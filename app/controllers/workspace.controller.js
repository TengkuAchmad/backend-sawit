// ENVIRONMENTS
require('dotenv').config();

// LIBRARIES
const { PrismaClient }     = require("@prisma/client");
const { v4: uuidv4 }       = require("uuid");

// CONSTANTS
const { successResponse }  	= require("../responses/responses.js");
const { badRequestResponse }= require("../responses/responses.js");

// PRISMA INSTANCE
const prisma               	= new PrismaClient();

// SERVICES
const { getLocalTime }     	= require("../services/time.service.js");
const { parseTime } 		= require("../services/time.service.js");
const file_services		 	= require("../services/file.service.js");

exports.create = async (req, res) => {
	try {
		const id = req.locals.user;

		const { name } = req.body;

		if (!name) {
			return badRequestResponse(res, "Please fill all required fields!");
		}

		await prisma.workspaceData.create({
			data: {
				UUID_WD: uuidv4(),
				UUID_UD: id,
				Name_WD: name,
				UpdatedAt_WD: getLocalTime(new Date()),
				CreatedAt_WD: getLocalTime(new Date())
			}
		});
		return successResponse(res, "Workspace created successfully!");

	} catch (e) {

	}
}

exports.getAll = async (req, res) => {
	try {
		const data = await prisma.workspaceData.findMany({
			select: {
				UUID_WD: true,
				UUID_UD: true,
				Name_WD: true,
			}, orderBy: {
				UUID_UD: 'asc',
			}
		});

		return successResponse(res, "Workspace data retrieved successfully!", data);
	} catch (e) {
		return badRequestResponse(res, "Internal Server Error", e.message);
	}
}

exports.getOne = async (req, res) => {
	try {
		const { id } = req.params;

		const data = await prisma.workspaceData.findFirst({
			where: {
				UUID_WD: id,
			}
		});

		return successResponse(res, "Workspace data retrieved successfully!", data);
	} catch (e) {
		return badRequestResponse(res, "Internal Server Error", e.message);
	}
}

exports.getByUser = async (req, res) => {
	try {
		const id = req.locals.user;

		const data = await prisma.workspaceData.findMany( {
			where: {
				UUID_UD: id,
			}, include: {
				ResultData: true,
			}, orderBy: {
				CreatedAt_WD: 'asc',
			}
		});

		const response = data.map(workspace => ({
			UUID_WD: workspace.UUID_WD,
			UUID_UD: workspace.UUID_UD,
			Name_WD: workspace.Name_WD,
			UpdatedAt_WD: parseTime(workspace.UpdatedAt_WD),
			CreatedAt_WD: parseTime(workspace.CreatedAt_WD),
			resultCount: workspace.ResultData.length,
		}));

		return successResponse(res, "Workspace data retrieved successfully!", response);
	} catch (e) {
		return badRequestResponse(res, "Internal Server Error", e.message);
	}
}

exports.deleteAll = async (req, res) => {
	try {
		const resultsData = await prisma.resultData.findMany({});

		for (let resultItem of resultsData) {

			await file_services.delete("iseuramoe", "captures", resultItem.PhotoName_RD);
		
			await prisma.resultData.delete({
				where: {
					UUID_RD: resultItem.UUID_RD
				}
			});
		}

		await prisma.workspaceData.deleteMany({});

		return successResponse(res, "All Workspace data deleted successfully!");
	} catch (e) {
		return badRequestResponse(res, "Internal Server Error", e.message);
	}
}

exports.deleteOne = async (req, res) => {
	try {
		const { id } = req.params;

		const resultsData = await prisma.resultData.findMany({
			where: {
				UUID_WD: id,
			}
		});

		for (let resultItem of resultsData) {

			await file_services.delete("iseuramoe", "captures", resultItem.PhotoName_RD);
		
			await prisma.resultData.delete({
				where: {
					UUID_RD: resultItem.UUID_RD
				}
			});
		}

		await prisma.workspaceData.deleteMany({
			where: {
				UUID_WD: id,
			}
		});

		return successResponse(res, "Workspace data deleted successfully!");

	} catch (e) {
		return badRequestResponse(res, "Internal Server Error", e.message);
	}
}

exports.deleteByUser = async (req, res) => {
	try {
		const id = req.locals.user;

		const workspacesData = await prisma.workspaceData.findMany({
			where: {
				UUID_UD: id
			}
		});

		for (let workspaces of workspacesData){
			
			const resultsData = await prisma.resultData.findMany({
				where: {
					UUID_WD: workspaces.UUID_WD,
				}
			});

			for (let resultItem of resultsData) {

				await file_services.delete("iseuramoe", "captures", resultItem.PhotoName_RD);
			
				await prisma.resultData.delete({
					where: {
						UUID_RD: resultItem.UUID_RD
					}
				});
			}
		}

		await prisma.workspaceData.deleteMany({
			where: {
				UUID_UD: id,
			}
		});

		return successResponse(res, "Workspace data by user is deleted successfully!");
	} catch (e) {
		return badRequestResponse(res, "Internal Server Error", e.message);
	}
}

exports.assignToWorkspace = async (req, res) => {
	try {
	  const { UUID_RD, UUID_WD } = req.body;
  
	  if (!UUID_RD || !UUID_WD) {
		return badRequestResponse(res, "Please fill all required fields!");
	  }
	  await prisma.resultData.update({
		where: { UUID_RD: req.body.UUID_RD },
		data: {
		  WorkspaceData: {
			connect: {
			  UUID_WD: req.body.UUID_WD,
			},
		  },
		},
	  });

	  await prisma.workspaceData.update({
		where: {
			UUID_WD: req.body.UUID_WD,
			UpdatedAt_WD: getLocalTime(new Date()),
		}
	  });
	
	  return successResponse(res, "Successfully saved the result data to workspace.");
	  
	} catch (e) {
	  return badRequestResponse(res, "Internal Server Error", e.message);
	}
}
  