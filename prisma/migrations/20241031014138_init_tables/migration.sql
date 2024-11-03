-- CreateTable
CREATE TABLE `user_role` (
    `user_role_id` VARCHAR(255) NOT NULL,
    `name` ENUM('admin', 'user') NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_user_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_user_id` VARCHAR(255) NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_user_id` VARCHAR(255) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `user_role_name_key`(`name`),
    PRIMARY KEY (`user_role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `user_id` VARCHAR(255) NOT NULL,
    `user_role_id` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone_number` VARCHAR(255) NULL,
    `password` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `is_verify` BOOLEAN NOT NULL DEFAULT false,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_user_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_user_id` VARCHAR(255) NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_user_id` VARCHAR(255) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp` (
    `otp_id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `code` VARCHAR(255) NOT NULL,
    `delivery_method` ENUM('email', 'whatsapp', 'sms') NOT NULL,
    `expired_at` DATETIME(3) NOT NULL,
    `is_used` BOOLEAN NOT NULL DEFAULT false,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_user_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_user_id` VARCHAR(255) NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_user_id` VARCHAR(255) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `otp_code_key`(`code`),
    PRIMARY KEY (`otp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_package` (
    `subscription_package_id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `contact_quota` INTEGER NOT NULL DEFAULT 0,
    `instance_quota` INTEGER NOT NULL DEFAULT 0,
    `price` DECIMAL(11, 2) NOT NULL DEFAULT 0,
    `discount` DECIMAL(11, 2) NOT NULL DEFAULT 0,
    `discount_type` ENUM('absolute', 'percentage') NOT NULL,
    `type` ENUM('welcome', 'paid_plan') NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_user_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_user_id` VARCHAR(255) NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_user_id` VARCHAR(255) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`subscription_package_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_subscription_package` (
    `user_subscription_package_id` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `total_contact_quota` INTEGER NOT NULL DEFAULT 0,
    `used_contact_quota` INTEGER NOT NULL DEFAULT 0,
    `total_instance_quota` INTEGER NOT NULL DEFAULT 0,
    `used_instance_quota` INTEGER NOT NULL DEFAULT 0,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_user_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_user_id` VARCHAR(255) NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_user_id` VARCHAR(255) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`user_subscription_package_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_subscription_package_item` (
    `user_subscription_package_item_id` VARCHAR(255) NOT NULL,
    `user_subscription_package_id` VARCHAR(255) NOT NULL,
    `subscription_package_id` VARCHAR(255) NOT NULL,
    `payment_id` VARCHAR(255) NOT NULL,
    `contact_quota` INTEGER NOT NULL DEFAULT 0,
    `instance_quota` INTEGER NOT NULL DEFAULT 0,
    `price` DECIMAL(11, 2) NOT NULL DEFAULT 0,
    `discount` DECIMAL(11, 2) NOT NULL DEFAULT 0,
    `discount_type` ENUM('absolute', 'percentage') NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_user_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_user_id` VARCHAR(255) NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_user_id` VARCHAR(255) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`user_subscription_package_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment` (
    `payment_id` VARCHAR(255) NOT NULL,
    `payment_number` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(11, 2) NOT NULL DEFAULT 0,
    `discount` DECIMAL(11, 2) NOT NULL DEFAULT 0,
    `discount_type` ENUM('absolute', 'percentage') NOT NULL,
    `status` ENUM('paid', 'refund') NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_user_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_user_id` VARCHAR(255) NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_user_id` VARCHAR(255) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_user_role_id_fkey` FOREIGN KEY (`user_role_id`) REFERENCES `user_role`(`user_role_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `otp` ADD CONSTRAINT `otp_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_subscription_package` ADD CONSTRAINT `user_subscription_package_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_subscription_package_item` ADD CONSTRAINT `user_subscription_package_item_user_subscription_package_id_fkey` FOREIGN KEY (`user_subscription_package_id`) REFERENCES `user_subscription_package`(`user_subscription_package_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_subscription_package_item` ADD CONSTRAINT `user_subscription_package_item_subscription_package_id_fkey` FOREIGN KEY (`subscription_package_id`) REFERENCES `subscription_package`(`subscription_package_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_subscription_package_item` ADD CONSTRAINT `user_subscription_package_item_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `payment`(`payment_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;
