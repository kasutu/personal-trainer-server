BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[auth.user] (
    [user_id] INT NOT NULL IDENTITY(1,1),
    [email] VARCHAR(100) NOT NULL,
    [username] VARCHAR(50),
    [hashed_password] VARCHAR(255) NOT NULL,
    [last_login_at] DATETIME2,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [auth.user_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [auth.user_pkey] PRIMARY KEY CLUSTERED ([user_id]),
    CONSTRAINT [auth.user_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [auth.user_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[auth.role] (
    [role_id] INT NOT NULL IDENTITY(1,1),
    [role_name] VARCHAR(50) NOT NULL,
    [role_description] TEXT,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [auth.role_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [auth.role_pkey] PRIMARY KEY CLUSTERED ([role_id]),
    CONSTRAINT [auth.role_role_name_key] UNIQUE NONCLUSTERED ([role_name])
);

-- CreateTable
CREATE TABLE [dbo].[auth.user_role] (
    [user_role_id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [role_id] INT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [auth.user_role_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [auth.user_role_pkey] PRIMARY KEY CLUSTERED ([user_role_id]),
    CONSTRAINT [auth.user_role_user_id_role_id_key] UNIQUE NONCLUSTERED ([user_id],[role_id])
);

-- CreateTable
CREATE TABLE [dbo].[main.membership] (
    [membership_id] INT NOT NULL IDENTITY(1,1),
    [membership_name] VARCHAR(30) NOT NULL,
    [membership_description] TEXT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [main.membership_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [main.membership_pkey] PRIMARY KEY CLUSTERED ([membership_id])
);

-- CreateTable
CREATE TABLE [dbo].[main.service] (
    [service_id] INT NOT NULL IDENTITY(1,1),
    [membership_id] INT NOT NULL,
    [service_name] VARCHAR(30) NOT NULL,
    [service_availability] VARCHAR(20) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [main.service_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [main.service_pkey] PRIMARY KEY CLUSTERED ([service_id])
);

-- CreateTable
CREATE TABLE [dbo].[main.person] (
    [person_id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT,
    [first_name] VARCHAR(30) NOT NULL,
    [middle_name] VARCHAR(30),
    [last_name] VARCHAR(30) NOT NULL,
    [gender] VARCHAR(10) NOT NULL,
    [date_of_birth] DATE NOT NULL,
    [phone] VARCHAR(15),
    [personal_email] VARCHAR(50),
    [is_active] BIT NOT NULL CONSTRAINT [main.person_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [main.person_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    [date_of_application] DATE,
    [applied_membership] VARCHAR(30),
    [month_of_application] VARCHAR(15),
    CONSTRAINT [main.person_pkey] PRIMARY KEY CLUSTERED ([person_id]),
    CONSTRAINT [main.person_user_id_key] UNIQUE NONCLUSTERED ([user_id])
);

-- CreateTable
CREATE TABLE [dbo].[main.member_subscription] (
    [subscription_id] INT NOT NULL IDENTITY(1,1),
    [person_id] INT NOT NULL,
    [membership_id] INT NOT NULL,
    [start_date] DATE NOT NULL,
    [end_date] DATE NOT NULL,
    [subscription_status] VARCHAR(20) NOT NULL CONSTRAINT [main.member_subscription_subscription_status_df] DEFAULT 'ACTIVE',
    [created_at] DATETIME2 NOT NULL CONSTRAINT [main.member_subscription_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [main.member_subscription_pkey] PRIMARY KEY CLUSTERED ([subscription_id])
);

-- CreateTable
CREATE TABLE [dbo].[main.member_preference_log] (
    [preference_log_id] INT NOT NULL IDENTITY(1,1),
    [person_id] INT NOT NULL,
    [goals] TEXT NOT NULL,
    [recorded_availability] VARCHAR(20) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [main.member_preference_log_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [main.member_preference_log_pkey] PRIMARY KEY CLUSTERED ([preference_log_id])
);

-- CreateTable
CREATE TABLE [dbo].[main.program] (
    [program_id] INT NOT NULL IDENTITY(1,1),
    [creator_id] INT NOT NULL,
    [membership_id] INT,
    [program_name] VARCHAR(50) NOT NULL,
    [program_description] TEXT NOT NULL,
    [program_type] VARCHAR(20) NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [main.program_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [main.program_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [main.program_pkey] PRIMARY KEY CLUSTERED ([program_id])
);

-- CreateTable
CREATE TABLE [dbo].[main.enrollment] (
    [enrollment_id] INT NOT NULL IDENTITY(1,1),
    [person_id] INT NOT NULL,
    [program_id] INT NOT NULL,
    [goals] TEXT NOT NULL,
    [start_date] DATE NOT NULL,
    [end_date] DATE NOT NULL,
    [is_active] BIT NOT NULL CONSTRAINT [main.enrollment_is_active_df] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [main.enrollment_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [main.enrollment_pkey] PRIMARY KEY CLUSTERED ([enrollment_id])
);

-- CreateTable
CREATE TABLE [dbo].[main.progress_log] (
    [progress_log_id] INT NOT NULL IDENTITY(1,1),
    [person_id] INT NOT NULL,
    [enrollment_id] INT NOT NULL,
    [progress] TEXT NOT NULL,
    [logged_at] DATETIME2 NOT NULL CONSTRAINT [main.progress_log_logged_at_df] DEFAULT CURRENT_TIMESTAMP,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [main.progress_log_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [main.progress_log_pkey] PRIMARY KEY CLUSTERED ([progress_log_id])
);

-- CreateTable
CREATE TABLE [dbo].[main.activity_log] (
    [id] INT NOT NULL IDENTITY(1,1),
    [person_id] INT NOT NULL,
    [activity_type] VARCHAR(50) NOT NULL,
    [activity_name] VARCHAR(100) NOT NULL,
    [description] TEXT,
    [duration_minutes] INT,
    [calories_burned] INT,
    [notes] TEXT,
    [recorded_at] DATETIME2 NOT NULL CONSTRAINT [main.activity_log_recorded_at_df] DEFAULT CURRENT_TIMESTAMP,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [main.activity_log_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [main.activity_log_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [auth.user_email_idx] ON [dbo].[auth.user]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [auth.user_username_idx] ON [dbo].[auth.user]([username]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [auth.role_role_name_idx] ON [dbo].[auth.role]([role_name]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [auth.user_role_user_id_idx] ON [dbo].[auth.user_role]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [auth.user_role_role_id_idx] ON [dbo].[auth.user_role]([role_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.service_membership_id_idx] ON [dbo].[main.service]([membership_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.person_user_id_idx] ON [dbo].[main.person]([user_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.person_is_active_idx] ON [dbo].[main.person]([is_active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.member_subscription_person_id_idx] ON [dbo].[main.member_subscription]([person_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.member_subscription_membership_id_idx] ON [dbo].[main.member_subscription]([membership_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.member_subscription_subscription_status_idx] ON [dbo].[main.member_subscription]([subscription_status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.member_preference_log_person_id_idx] ON [dbo].[main.member_preference_log]([person_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.program_creator_id_idx] ON [dbo].[main.program]([creator_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.program_membership_id_idx] ON [dbo].[main.program]([membership_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.program_program_type_idx] ON [dbo].[main.program]([program_type]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.program_is_active_idx] ON [dbo].[main.program]([is_active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.enrollment_person_id_idx] ON [dbo].[main.enrollment]([person_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.enrollment_program_id_idx] ON [dbo].[main.enrollment]([program_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.enrollment_is_active_idx] ON [dbo].[main.enrollment]([is_active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.progress_log_person_id_idx] ON [dbo].[main.progress_log]([person_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.progress_log_enrollment_id_idx] ON [dbo].[main.progress_log]([enrollment_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.progress_log_logged_at_idx] ON [dbo].[main.progress_log]([logged_at]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.activity_log_person_id_idx] ON [dbo].[main.activity_log]([person_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.activity_log_activity_type_idx] ON [dbo].[main.activity_log]([activity_type]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [main.activity_log_recorded_at_idx] ON [dbo].[main.activity_log]([recorded_at]);

-- AddForeignKey
ALTER TABLE [dbo].[auth.user_role] ADD CONSTRAINT [auth.user_role_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[auth.user]([user_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[auth.user_role] ADD CONSTRAINT [auth.user_role_role_id_fkey] FOREIGN KEY ([role_id]) REFERENCES [dbo].[auth.role]([role_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[main.service] ADD CONSTRAINT [main.service_membership_id_fkey] FOREIGN KEY ([membership_id]) REFERENCES [dbo].[main.membership]([membership_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[main.member_subscription] ADD CONSTRAINT [main.member_subscription_person_id_fkey] FOREIGN KEY ([person_id]) REFERENCES [dbo].[main.person]([person_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[main.member_subscription] ADD CONSTRAINT [main.member_subscription_membership_id_fkey] FOREIGN KEY ([membership_id]) REFERENCES [dbo].[main.membership]([membership_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[main.member_preference_log] ADD CONSTRAINT [main.member_preference_log_person_id_fkey] FOREIGN KEY ([person_id]) REFERENCES [dbo].[main.person]([person_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[main.program] ADD CONSTRAINT [main.program_creator_id_fkey] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[main.person]([person_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[main.program] ADD CONSTRAINT [main.program_membership_id_fkey] FOREIGN KEY ([membership_id]) REFERENCES [dbo].[main.membership]([membership_id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[main.enrollment] ADD CONSTRAINT [main.enrollment_person_id_fkey] FOREIGN KEY ([person_id]) REFERENCES [dbo].[main.person]([person_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[main.enrollment] ADD CONSTRAINT [main.enrollment_program_id_fkey] FOREIGN KEY ([program_id]) REFERENCES [dbo].[main.program]([program_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[main.progress_log] ADD CONSTRAINT [main.progress_log_person_id_fkey] FOREIGN KEY ([person_id]) REFERENCES [dbo].[main.person]([person_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[main.progress_log] ADD CONSTRAINT [main.progress_log_enrollment_id_fkey] FOREIGN KEY ([enrollment_id]) REFERENCES [dbo].[main.enrollment]([enrollment_id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[main.activity_log] ADD CONSTRAINT [main.activity_log_person_id_fkey] FOREIGN KEY ([person_id]) REFERENCES [dbo].[main.person]([person_id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
