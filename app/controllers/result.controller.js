// ENVIRONMENTS
require('dotenv').config();

// LIBRARIES
const { PrismaClient }     = require("@prisma/client");
const { v4: uuidv4 }       = require("uuid");

// CONSTANTS
const { successResponse }  = require("../responses/responses.js");
const { badRequestResponse}   = require("../responses/responses.js");

// PRISMA INSTANCE
const prisma               = new PrismaClient();

// SERVICES
const { getLocalTime }     = require("../services/time.service.js");

// ESSENTIALS FUNCTION
exports.create = async (req, res) => {
	try {
		if (!req.body.title || !req.body.latitude || !req.body.longitude || !req.body.kabupaten || !req.body.desa || !req.body.kecamatan || !req.body.umur || !req.body.lereng || !req.body.drainase || !req.body.genangan || !req.body.topografi || !req.body.erosi || !req.body.batuanper || !req.body.batuansin || !req.body.ketinggian || !req.body.alb || !req.body.rendemen || !req.body.densitas || !req.body.min_transmittan || !req.body.max_transmittan || !req.body.min_gelombang || !req.body.max_gelombang){
			return badRequestResponse(res, "Please fill all required fields!");
		}

		const id_sri = uuidv4();
		const id_sori = uuidv4();
		const id_pri = uuidv4();
		const id_tri = uuidv4();
		const id_gri = uuidv4();
		const id_ri = uuidv4();

		await prisma.socialResultIndex.create({
			data: {
				UUID_SRI: id_sri,
				Longitude_SRI: req.body.longitude,
				Latitude_SRI: req.body.latitude,
				Kabupaten_SRI: req.body.kabupaten,
				Desa_SRI: req.body.desa,
				Kecamatan_SRI: req.body.kecamatan
			}
		});

		await prisma.soilResultIndex.create({
			data: {
				UUID_SORI: id_sori,
				Umur_SORI: req.body.umur,
				Lereng_SORI: req.body.lereng,
				Drainase_SORI: req.body.drainase,
				Genangan_SORI: req.body.genangan,
				Topografi_SORI: req.body.topografi,
				BahayaErosi_SORI: req.body.erosi,
				BatuanPer_SORI: req.body.batuanper,
				BatuanSin_SORI: req.body.batuansin,
				Ketinggian_SORI: req.body.ketinggian
			}
		});

		await prisma.palmResultIndex.create({
			data: {
				UUID_PRI: id_pri,
				ALB_PRI: req.body.alb,
				Rendemen_PRI: req.body.rendemen,
				Densitas_PRI: req.body.densitas
			}
		});

		await prisma.transmittanResultIndex.create({
			data: {
				UUID_TRI: id_tri,
				Min_TRI: req.body.min_transmittan,
				Max_TRI: req.body.max_transmittan
			}
		});

		await prisma.gelombangResultIndex.create({
			data: {
				UUID_GRI: id_gri,
				Min_GRI: req.body.min_gelombang,
				Max_GRI: req.body.max_gelombang,
			}
		});


		await prisma.resultIndex.create({
			data: {
				UUID_RI: id_ri,
				UUID_SRI: id_sri,
				UUID_SORI: id_sori,
				UUID_PRI: id_pri,
				UUID_TRI: id_tri,
				UUID_GRI: id_gri,
				Title_RI: req.body.title,
				CreatedAt_RI: getLocalTime(new Date()),
				UpdatedAt_RI: getLocalTime(new Date())
			}
		});

		return successResponse(res, "Data Result Index successfully added!");

	} catch (e) {
		return badRequestResponse(res, "Internal Server Error", e.message);
	}
}

exports.getAll = async (req, res) => {
	try {
		const data = await prisma.resultIndex.findMany({
			include: {
				SocialResultIndex: true,
				SoilResultIndex: true,
				PalmResultIndex: true,
				TransmittanResultIndex: true,
				GelombangResultIndex: true,
			}
		});

		return successResponse(res,"Data fetched succesfully", data);
	} catch (e) {
		return badRequestResponse(res, "Internal Server Error", e.message);
	}
}

exports.getAllNames = async (req, res) => {
	try {
		const data = await prisma.resultIndex.findMany({
			select: {
				Title_RI: true
			}
		});

		return successResponse(res,"Data fetched succesfully", data);
	} catch (e) {
		return badRequestResponse(res, "Internal Server Error", e.message);
	}
}