BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[membership] (
    [membership_id] INT NOT NULL IDENTITY(1,1),
    [membership_name] VARCHAR(30) NOT NULL,
    [membership_description] TEXT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [membership_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [membership_pkey] PRIMARY KEY CLUSTERED ([membership_id])
);

-- CreateTable
CREATE TABLE [dbo].[service] (
    [service_id] INT NOT NULL IDENTITY(1,1),
    [membership_id] INT NOT NULL,
    [service_name] VARCHAR(30) NOT NULL,
    [service_availability] VARCHAR(20) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [service_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [service_pkey] PRIMARY KEY CLUSTERED ([service_id])
);

-- CreateTable
CREATE TABLE [dbo].[member] (
    [member_id] INT NOT NULL IDENTITY(1,1),
    [member_account_credentials_id] INT,
    [first_name] VARCHAR(30) NOT NULL,
    [middle_name] VARCHAR(30),
    [last_name] VARCHAR(30) NOT NULL,
    [gender] VARCHAR(10) NOT NULL,
    [date_of_birth] DATE NOT NULL,
    [phone] VARCHAR(15) NOT NULL,
    [date_of_application] DATE NOT NULL,
    [applied_membership] VARCHAR(30) NOT NULL,
    [month_of_application] VARCHAR(15) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [member_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [member_pkey] PRIMARY KEY CLUSTERED ([member_id]),
    CONSTRAINT [member_member_account_credentials_id_key] UNIQUE NONCLUSTERED ([member_account_credentials_id])
);

-- CreateTable
CREATE TABLE [dbo].[member_account_credentials] (
    [member_account_credentials_id] INT NOT NULL IDENTITY(1,1),
    [email] VARCHAR(50) NOT NULL,
    [hashed_password] VARCHAR(255) NOT NULL,
    [last_login_at] DATETIME2,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [member_account_credentials_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [member_account_credentials_pkey] PRIMARY KEY CLUSTERED ([member_account_credentials_id]),
    CONSTRAINT [member_account_credentials_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[member_subscription] (
    [subscription_id] INT NOT NULL IDENTITY(1,1),
    [member_id] INT NOT NULL,
    [membership_id] INT NOT NULL,
    [start_date] DATE NOT NULL,
    [end_date] DATE NOT NULL,
    [subscription_status] VARCHAR(20) NOT NULL CONSTRAINT [member_subscription_subscription_status_df] DEFAULT 'ACTIVE',
    [created_at] DATETIME2 NOT NULL CONSTRAINT [member_subscription_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [member_subscription_pkey] PRIMARY KEY CLUSTERED ([subscription_id])
);

-- CreateTable
CREATE TABLE [dbo].[member_standard_preference_log] (
    [member_standard_preference_log_id] INT NOT NULL IDENTITY(1,1),
    [member_id] INT NOT NULL,
    [goals] TEXT NOT NULL,
    [recorded_availability] VARCHAR(20) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [member_standard_preference_log_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [member_standard_preference_log_pkey] PRIMARY KEY CLUSTERED ([member_standard_preference_log_id])
);

-- CreateTable
CREATE TABLE [dbo].[instructor] (
    [instructor_id] INT NOT NULL IDENTITY(1,1),
    [first_name] VARCHAR(30) NOT NULL,
    [middle_name] VARCHAR(30),
    [last_name] VARCHAR(30) NOT NULL,
    [gender] VARCHAR(10) NOT NULL,
    [date_of_birth] DATE NOT NULL,
    [email] VARCHAR(50) NOT NULL,
    [number] VARCHAR(15) NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [instructor_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [instructor_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [instructor_pkey] PRIMARY KEY CLUSTERED ([instructor_id]),
    CONSTRAINT [instructor_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[instructor_account_credentials] (
    [instructor_account_credentials_id] INT NOT NULL IDENTITY(1,1),
    [instructor_id] INT NOT NULL,
    [username] VARCHAR(30) NOT NULL,
    [hashed_password] VARCHAR(255) NOT NULL,
    [last_login_at] DATETIME2,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [instructor_account_credentials_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [instructor_account_credentials_pkey] PRIMARY KEY CLUSTERED ([instructor_account_credentials_id]),
    CONSTRAINT [instructor_account_credentials_instructor_id_key] UNIQUE NONCLUSTERED ([instructor_id]),
    CONSTRAINT [instructor_account_credentials_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[standard_program] (
    [standard_program_id] INT NOT NULL IDENTITY(1,1),
    [instructor_id] INT NOT NULL,
    [membership_id] INT NOT NULL,
    [standard_program_name] VARCHAR(50) NOT NULL,
    [standard_program_description] TEXT NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [standard_program_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [standard_program_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [standard_program_pkey] PRIMARY KEY CLUSTERED ([standard_program_id])
);

-- CreateTable
CREATE TABLE [dbo].[standard_program_enrollment] (
    [standard_program_enrollment_id] INT NOT NULL IDENTITY(1,1),
    [member_id] INT NOT NULL,
    [standard_program_id] INT NOT NULL,
    [goals] TEXT NOT NULL,
    [start_date] DATE NOT NULL,
    [end_date] DATE NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [standard_program_enrollment_isActive_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [standard_program_enrollment_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [standard_program_enrollment_pkey] PRIMARY KEY CLUSTERED ([standard_program_enrollment_id])
);

-- CreateTable
CREATE TABLE [dbo].[personalized_program] (
    [personalized_program_id] INT NOT NULL IDENTITY(1,1),
    [member_id] INT NOT NULL,
    [instructor_id] INT NOT NULL,
    [personalized_program_name] VARCHAR(40) NOT NULL,
    [personalized_program_description] TEXT NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [personalized_program_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [personalized_program_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [personalized_program_pkey] PRIMARY KEY CLUSTERED ([personalized_program_id])
);

-- CreateTable
CREATE TABLE [dbo].[personalized_program_enrollment] (
    [personalized_program_enrollment_id] INT NOT NULL IDENTITY(1,1),
    [member_id] INT NOT NULL,
    [personalized_program_id] INT NOT NULL,
    [goals] TEXT NOT NULL,
    [start_date] DATE NOT NULL,
    [end_date] DATE NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [personalized_program_enrollment_isActive_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [personalized_program_enrollment_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [personalized_program_enrollment_pkey] PRIMARY KEY CLUSTERED ([personalized_program_enrollment_id])
);

-- CreateTable
CREATE TABLE [dbo].[member_personalized_progress_log] (
    [member_personalized_progress_log_id] INT NOT NULL IDENTITY(1,1),
    [member_id] INT NOT NULL,
    [personalized_program_enrollment_id] INT NOT NULL,
    [progress] TEXT NOT NULL,
    [logged_at] DATETIME2 NOT NULL CONSTRAINT [member_personalized_progress_log_logged_at_df] DEFAULT CURRENT_TIMESTAMP,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [member_personalized_progress_log_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [member_personalized_progress_log_pkey] PRIMARY KEY CLUSTERED ([member_personalized_progress_log_id])
);

-- CreateTable
CREATE TABLE [dbo].[admin] (
    [admin_id] INT NOT NULL IDENTITY(1,1),
    [first_name] VARCHAR(30) NOT NULL,
    [middle_name] VARCHAR(30),
    [last_name] VARCHAR(30) NOT NULL,
    [email] VARCHAR(50) NOT NULL,
    [role] VARCHAR(20) NOT NULL CONSTRAINT [admin_role_df] DEFAULT 'ADMIN',
    [is_active] BIT NOT NULL CONSTRAINT [admin_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [admin_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [admin_pkey] PRIMARY KEY CLUSTERED ([admin_id]),
    CONSTRAINT [admin_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[admin_account_credentials] (
    [admin_account_credentials_id] INT NOT NULL IDENTITY(1,1),
    [admin_id] INT NOT NULL,
    [username] VARCHAR(30) NOT NULL,
    [hashed_password] VARCHAR(255) NOT NULL,
    [last_login_at] DATETIME2,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [admin_account_credentials_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [admin_account_credentials_pkey] PRIMARY KEY CLUSTERED ([admin_account_credentials_id]),
    CONSTRAINT [admin_account_credentials_admin_id_key] UNIQUE NONCLUSTERED ([admin_id]),
    CONSTRAINT [admin_account_credentials_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[activity_log] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [user_type] VARCHAR(20) NOT NULL,
    [action] VARCHAR(100) NOT NULL,
    [description] TEXT,
    [ip_address] VARCHAR(45),
    [user_agent] TEXT,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [activity_log_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [activity_log_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [service_membership_id_idx] ON [dbo].[service]([membership_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [member_member_account_credentials_id_idx] ON [dbo].[member]([member_account_credentials_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [member_account_credentials_email_idx] ON [dbo].[member_account_credentials]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [member_subscription_member_id_idx] ON [dbo].[member_subscription]([member_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [member_subscription_membership_id_idx] ON [dbo].[member_subscription]([membership_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [member_subscription_subscription_status_idx] ON [dbo].[member_subscription]([subscription_status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [member_standard_preference_log_member_id_idx] ON [dbo].[member_standard_preference_log]([member_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [instructor_email_idx] ON [dbo].[instructor]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [instructor_is_active_idx] ON [dbo].[instructor]([is_active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [instructor_account_credentials_username_idx] ON [dbo].[instructor_account_credentials]([username]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [standard_program_instructor_id_idx] ON [dbo].[standard_program]([instructor_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [standard_program_membership_id_idx] ON [dbo].[standard_program]([membership_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [standard_program_is_active_idx] ON [dbo].[standard_program]([is_active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [standard_program_enrollment_member_id_idx] ON [dbo].[standard_program_enrollment]([member_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [standard_program_enrollment_standard_program_id_idx] ON [dbo].[standard_program_enrollment]([standard_program_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [standard_program_enrollment_isActive_idx] ON [dbo].[standard_program_enrollment]([isActive]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [personalized_program_member_id_idx] ON [dbo].[personalized_program]([member_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [personalized_program_instructor_id_idx] ON [dbo].[personalized_program]([instructor_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [personalized_program_is_active_idx] ON [dbo].[personalized_program]([is_active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [personalized_program_enrollment_member_id_idx] ON [dbo].[personalized_program_enrollment]([member_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [personalized_program_enrollment_personalized_program_id_idx] ON [dbo].[personalized_program_enrollment]([personalized_program_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [personalized_program_enrollment_isActive_idx] ON [dbo].[personalized_program_enrollment]([isActive]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [member_personalized_progress_log_member_id_idx] ON [dbo].[member_personalized_progress_log]([member_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [member_personalized_progress_log_personalized_program_enrollment_id_idx] ON [dbo].[member_personalized_progress_log]([personalized_program_enrollment_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [member_personalized_progress_log_logged_at_idx] ON [dbo].[member_personalized_progress_log]([logged_at]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [admin_email_idx] ON [dbo].[admin]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [admin_role_idx] ON [dbo].[admin]([role]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [admin_is_active_idx] ON [dbo].[admin]([is_active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [admin_account_credentials_username_idx] ON [dbo].[admin_account_credentials]([username]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [activity_log_user_id_user_type_idx] ON [dbo].[activity_log]([user_id], [user_type]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [activity_log_action_idx] ON [dbo].[activity_log]([action]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [activity_log_created_at_idx] ON [dbo].[activity_log]([created_at]);

-- AddForeignKey
ALTER TABLE [dbo].[service] ADD CONSTRAINT [service_membership_id_fkey] FOREIGN KEY ([membership_id]) REFERENCES [dbo].[membership]([membership_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[member] ADD CONSTRAINT [member_member_account_credentials_id_fkey] FOREIGN KEY ([member_account_credentials_id]) REFERENCES [dbo].[member_account_credentials]([member_account_credentials_id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[member_subscription] ADD CONSTRAINT [member_subscription_member_id_fkey] FOREIGN KEY ([member_id]) REFERENCES [dbo].[member]([member_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[member_subscription] ADD CONSTRAINT [member_subscription_membership_id_fkey] FOREIGN KEY ([membership_id]) REFERENCES [dbo].[membership]([membership_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[member_standard_preference_log] ADD CONSTRAINT [member_standard_preference_log_member_id_fkey] FOREIGN KEY ([member_id]) REFERENCES [dbo].[member]([member_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[instructor_account_credentials] ADD CONSTRAINT [instructor_account_credentials_instructor_id_fkey] FOREIGN KEY ([instructor_id]) REFERENCES [dbo].[instructor]([instructor_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[standard_program] ADD CONSTRAINT [standard_program_instructor_id_fkey] FOREIGN KEY ([instructor_id]) REFERENCES [dbo].[instructor]([instructor_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[standard_program] ADD CONSTRAINT [standard_program_membership_id_fkey] FOREIGN KEY ([membership_id]) REFERENCES [dbo].[membership]([membership_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[standard_program_enrollment] ADD CONSTRAINT [standard_program_enrollment_member_id_fkey] FOREIGN KEY ([member_id]) REFERENCES [dbo].[member]([member_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[standard_program_enrollment] ADD CONSTRAINT [standard_program_enrollment_standard_program_id_fkey] FOREIGN KEY ([standard_program_id]) REFERENCES [dbo].[standard_program]([standard_program_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[personalized_program] ADD CONSTRAINT [personalized_program_member_id_fkey] FOREIGN KEY ([member_id]) REFERENCES [dbo].[member]([member_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[personalized_program] ADD CONSTRAINT [personalized_program_instructor_id_fkey] FOREIGN KEY ([instructor_id]) REFERENCES [dbo].[instructor]([instructor_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[personalized_program_enrollment] ADD CONSTRAINT [personalized_program_enrollment_member_id_fkey] FOREIGN KEY ([member_id]) REFERENCES [dbo].[member]([member_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[personalized_program_enrollment] ADD CONSTRAINT [personalized_program_enrollment_personalized_program_id_fkey] FOREIGN KEY ([personalized_program_id]) REFERENCES [dbo].[personalized_program]([personalized_program_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[member_personalized_progress_log] ADD CONSTRAINT [member_personalized_progress_log_member_id_fkey] FOREIGN KEY ([member_id]) REFERENCES [dbo].[member]([member_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[member_personalized_progress_log] ADD CONSTRAINT [member_personalized_progress_log_personalized_program_enrollment_id_fkey] FOREIGN KEY ([personalized_program_enrollment_id]) REFERENCES [dbo].[personalized_program_enrollment]([personalized_program_enrollment_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[admin_account_credentials] ADD CONSTRAINT [admin_account_credentials_admin_id_fkey] FOREIGN KEY ([admin_id]) REFERENCES [dbo].[admin]([admin_id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
