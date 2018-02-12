USE [ToDoByHayim]
GO

/****** Object:  Table [dbo].[Task]    Script Date: 2/12/2018 11:33:52 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Task](
	[CreatedBy] [nvarchar](50) NOT NULL,
	[CreatedFor] [nvarchar](50) NOT NULL,
	[Title] [nvarchar](50) NOT NULL,
	[EstimatedHours] [smallint] NOT NULL,
	[CreatedTime] [datetime] NULL,
	[Id] [int] IDENTITY(1,1) NOT NULL,
 CONSTRAINT [PK_Task] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Task] ADD  CONSTRAINT [DF_Task_CreatedTime]  DEFAULT (getdate()) FOR [CreatedTime]
GO


