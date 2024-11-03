// prisma
import prisma from "../pkg/prisma";
import { DeliveryMethodEnum, Prisma } from "@prisma/client";
// types
import {
  LoginRequestType,
  OtpGenerateRequestType,
  OtpMethod,
  OtpVerifyRequestType,
  RegisterRequestType,
} from "../types/controllersTypes";
import { jwyPayloadType, ResponseFormatType } from "../types/helpersTypes";
// helperes
import { generateOTP, generateUUID, phoneNumberFormatter } from "../helpers/utils";
import { encrypt, compare } from "../helpers/crypto";
import { otpTemplate } from "../helpers/emailTemplate";
// configs
import { globalConfig } from "../configs";
// service
import EmailService from "./emailService";
import { generateJWTToken } from "../helpers/jwt";
import { otpWaTemplate } from "../helpers/waTemplates";

class AuthService {
  /**
   * Register
   */
  static async login(
    params: LoginRequestType
  ): Promise<ResponseFormatType<any>> {
    try {
      // get user
      const value =
        params.otp_method === OtpMethod.email
          ? params.email ?? ""
          : params.phone_number ?? "";

      const user = await prisma.user.findFirst({
        where: {
          [params.otp_method === OtpMethod.email ? "email" : "phone_number"]:
            value,
        },
        include: {
          user_role: {
            select: {
              name: true,
            },
          },
        },
      });

      if (user == null) {
        return {
          statusCode: 401,
          message: "invalid credential",
        };
      } else {
        // check password
        if (!compare(params.password, user.password)) {
          return {
            statusCode: 401,
            message: "invalid credential",
          };
        } else {
          // check is verify
          if (!user.is_verify) {
            // generate otp
            const resultOtp = await this.otpGenerate({
              otp_method: params.otp_method,
              value,
            });

            return {
              statusCode: 401,
              message: "otp required",
              data: resultOtp.data,
            };
          } else {
            // generate token
            let jwtPayload: jwyPayloadType = {
              user_id: user.user_id,
              role: user.user_role.name,
              expired: Math.floor(
                (Date.now() + Number(globalConfig.jwtExpired) * 1000) / 1000
              ),
            };

            return {
              statusCode: 200,
              message: "login success",
              data: {
                token: generateJWTToken(jwtPayload),
              },
            };
          }
        }
      }
    } catch (error: any) {
      console.log("error - login - authService.ts:", error.message);
      throw new Error("login failed");
    }
  }

  /**
   * Register
   */
  static async register(
    params: RegisterRequestType
  ): Promise<ResponseFormatType<any>> {
    try {
      // get user role
      const userRole = await prisma.userRole.findFirst({
        where: {
          name: "user",
        },
      });

      if (userRole == null) {
        console.log("error - register - authService.ts: user role not found");
        throw new Error("register failed");
      } else {
        // get welcome package
        const welcomePackage = await prisma.subscriptionPackage.findFirst({
          where: {
            type: "welcome",
          },
        });

        if (welcomePackage == null) {
          console.log(
            "error - register - authService.ts: welcome package found"
          );
          throw new Error("register failed");
        } else {
          const userID = generateUUID();
          const paymentID = generateUUID();
          const userSubscriptionPackageID = generateUUID();

          // calculate amount paymeny
          let amountPayment = new Prisma.Decimal(0);
          if (welcomePackage.discount_type === "absolute") {
            amountPayment = welcomePackage.price.minus(welcomePackage.discount);
          } else if (welcomePackage.discount_type === "percentage") {
            const amountDiscount = welcomePackage.discount
              .times(welcomePackage.price)
              .dividedBy(100);
            amountPayment = welcomePackage.price.minus(amountDiscount);
          }

          const [
            userSubscriptionPackage,
            payment,
            userSubscriptionPackageItem,
          ] = await prisma.$transaction([
            // create user
            prisma.user.create({
              data: {
                user_id: userID,
                user_role_id: userRole?.user_role_id ?? "",
                email:
                  params.otp_method == OtpMethod.email
                    ? params.email ?? ""
                    : "",
                phone_number:
                  params.otp_method == OtpMethod.phone_number
                    ? params.phone_number ?? ""
                    : "",
                first_name: params.first_name,
                last_name: params.last_name,
                password: encrypt(params.password),
                is_verify: false,
                deleted: false,
                created_user_id: "register",
              },
            }),
            // create user subscription package
            prisma.userSubscriptionPackage.create({
              data: {
                user_subscription_package_id: userSubscriptionPackageID,
                user_id: userID,
                total_contact_quota: welcomePackage.contact_quota,
                total_instance_quota: welcomePackage.instance_quota,
                used_contact_quota: 0,
                used_instance_quota: 0,
                deleted: false,
                created_user_id: "register",
              },
            }),
            // create payment
            prisma.payment.create({
              data: {
                payment_id: paymentID,
                payment_number: generateUUID(),
                user_id: userID,
                discount: welcomePackage.discount,
                discount_type: welcomePackage.discount_type,
                amount: amountPayment,
                status: "paid",
                deleted: false,
                created_user_id: "register",
              },
            }),
            // create user subscription package item
            prisma.userSubscriptionPackageItem.create({
              data: {
                user_subscription_package_item_id: generateUUID(),
                user_subscription_package_id: userSubscriptionPackageID,
                subscription_package_id: welcomePackage.subscription_package_id,
                payment_id: paymentID,
                contact_quota: welcomePackage.contact_quota,
                instance_quota: welcomePackage.instance_quota,
                price: welcomePackage.price,
                discount: welcomePackage.discount,
                discount_type: welcomePackage.discount_type,
                deleted: false,
                created_user_id: "register",
              },
            }),
          ]);

          // generate otp
          const resultOtp = await this.otpGenerate({
            otp_method: params.otp_method,
            value:
              params.otp_method === OtpMethod.email
                ? params.email ?? ""
                : params.phone_number ?? "",
          });

          // TODO
          // commit if generate OTP success

          return {
            statusCode: 201,
            message: "register success",
            data: resultOtp.data,
          };
        }
      }
    } catch (error: any) {
      // TODO
      // rollback if generate OTP failed
      if (error.message == "generate otp failed") {
      }

      console.log("error - register - authService.ts:", error.message);
      throw new Error("register failed");
    }
  }

  /**
   * Otp Generate
   */
  static async otpGenerate(
    params: OtpGenerateRequestType
  ): Promise<ResponseFormatType<any>> {
    try {
      // get user
      const user = await prisma.user.findFirst({
        where: {
          [params.otp_method === OtpMethod.email ? "email" : "phone_number"]:
            params.value,
        },
      });

      // fill delivery method
      const deliveryMethod =
        params.otp_method === OtpMethod.email
          ? DeliveryMethodEnum.email
          : DeliveryMethodEnum.whatsapp;

      if (user == null) {
        return {
          statusCode: 404,
          message: "user not found",
        };
      } else {
        const otpCode = generateOTP();
        const expiredAt = new Date(
          Date.now() + Number(globalConfig.otpExpired) * 1000
        );

        // send otp
        if (deliveryMethod == DeliveryMethodEnum.email) {
          await EmailService.sendMail({
            to: params.value,
            subject: "OTP",
            text: "VERIFIKASI PENDAFTARAN AKUN",
            html: otpTemplate({
              name: user.first_name,
              code: otpCode,
              expired: Number(globalConfig.otpExpired),
            }),
          });
        } else if (deliveryMethod == DeliveryMethodEnum.whatsapp) {
          
        }

        // create otp
        await prisma.otp.create({
          data: {
            otp_id: generateUUID(),
            user_id: user.user_id,
            code: otpCode,
            delivery_method: deliveryMethod,
            expired_at: expiredAt,
            is_used: false,
            deleted: false,
            created_user_id: user.user_id,
          },
        });

        return {
          statusCode: 200,
          message: "generate otp success",
          data: {
            delivery_method: deliveryMethod,
            expired_at: expiredAt,
          },
        };
      }
    } catch (error: any) {
      console.log("error - otpGenerate - authService.ts:", error.message);
      throw new Error("generate otp failed");
    }
  }

  /**
   * Otp Verify
   */
  static async otpVerify(
    params: OtpVerifyRequestType
  ): Promise<ResponseFormatType<any>> {
    try {
      // get user
      const user = await prisma.user.findFirst({
        where: {
          [params.otp_method === OtpMethod.email ? "email" : "phone_number"]:
            params.value,
        },
      });

      if (user == null) {
        return {
          statusCode: 404,
          message: "user not found",
        };
      } else {
        if (!user.is_verify) {
          const otp = await prisma.otp.findFirst({
            where: {
              user_id: user.user_id,
              code: params.otp_code,
              is_used: false,
            },
          });

          if (otp == null) {
            return {
              statusCode: 401,
              message: "invalid otp code",
            };
          } else {
            if (new Date() > otp.expired_at) {
              return {
                statusCode: 401,
                message: "expired otp code",
              };
            } else {
              await prisma.$transaction([
                prisma.otp.update({
                  // update otp
                  data: {
                    is_used: true,
                    updated_user_id: user.user_id,
                    updated_at: new Date(),
                  },
                  where: {
                    otp_id: otp.otp_id,
                  },
                }),
                prisma.user.update({
                  // update user
                  data: {
                    is_verify: true,
                    updated_user_id: user.user_id,
                    updated_at: new Date(),
                  },
                  where: {
                    user_id: user.user_id,
                  },
                }),
              ]);
            }
          }
        }

        return {
          statusCode: 200,
          message: "verify otp success",
        };
      }
    } catch (error: any) {
      console.log("error - otpVerify - authService.ts:", error.message);
      throw new Error("verify otp failed");
    }
  }
}

export default AuthService;
