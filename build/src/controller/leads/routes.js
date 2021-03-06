"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const lead_controller_1 = require("./lead-controller");
const user_validator_1 = require("../users/user-validator");
const index_1 = require("../../mongo/index");
const code_errors_1 = require("../../common/code-errors");
const LeadValidator = require("./lead-validator");
function default_1(server, configs, database) {
    const leadController = new lead_controller_1.default(configs, database);
    server.bind(leadController);
    server.route({
        method: 'GET',
        path: '/leads/{id}',
        config: {
            handler: leadController.findById,
            // auth: "jwt",
            tags: ['api', 'leads'],
            description: '#googledrive #KH-lienhe14 Find a lead by leadId',
            validate: {
                params: {
                    id: Joi.number()
                        .required()
                        .example(38)
                        .description('leadid')
                },
                headers: user_validator_1.headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: code_errors_1.MsgCodeResponses.INPUT_INVALID,
                        msg: code_errors_1.MsgCodeResponses.INPUT_INVALID
                    };
                    index_1.LogLead.create({
                        type: 'detaillead',
                        dataInput: request.payload,
                        msg: 'payload do not valid',
                        meta: {
                            exception: error,
                            response: res
                        },
                    });
                    reply(res);
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object(),
                                msg: Joi.string()
                            })
                        },
                        404: {
                            description: 'not found',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/leads/history/{leadid}',
        config: {
            handler: leadController.histories,
            // auth: "jwt",
            tags: ['api', 'leads'],
            description: '#screenv3/KH-tuvan:16, #screenv3/KH-lienhe:16 get histories of leadId',
            validate: {
                headers: user_validator_1.headerModel,
                params: {
                    leadid: Joi.number()
                        .required()
                        .example(38)
                        .description('leadid')
                },
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: code_errors_1.MsgCodeResponses.INPUT_INVALID,
                        msg: code_errors_1.MsgCodeResponses.INPUT_INVALID
                    };
                    index_1.LogLead.create({
                        type: 'detaillead',
                        dataInput: request.payload,
                        msg: 'payload do not valid',
                        meta: {
                            exception: error,
                            response: res
                        },
                    });
                    reply(res);
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object(),
                                msg: Joi.string()
                            })
                        },
                        404: {
                            description: 'not found',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    /**
   * lấy 1 campaign theo period
   */
    server.route({
        method: 'GET',
        path: '/leads/{period}/{processstep}/{status}',
        config: {
            handler: leadController.list,
            // auth: "jwt",
            tags: ['api', 'leads'],
            description: '#driveKH-lienhe, #screen 12,13 Get leads and activities of lead by period',
            validate: {
                headers: user_validator_1.headerModel,
                params: {
                    period: Joi
                        .number()
                        .integer()
                        .default(1)
                        .description('12 month')
                        .required(),
                    processstep: Joi
                        .number()
                        .integer()
                        .default(1)
                        .valid([1, 2, 3, 4])
                        .required(),
                    status: Joi
                        .number()
                        .integer()
                        .description('status of process step')
                        .valid([1, 2, 3, 4])
                        .required()
                },
                query: Joi.object({
                    limit: Joi
                        .number()
                        .integer()
                        .default(1)
                        .required(),
                    page: Joi
                        .number()
                        .integer()
                        .default(1)
                        .required()
                })
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object({
                                    data: Joi.array().example([]),
                                    limit: Joi.number(),
                                    page: Joi.number(),
                                    totalCount: Joi.number().required()
                                }),
                                msg: Joi.string()
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        }
                    }
                }
            }
        }
    });
    /**
     * Update a lead
     */
    server.route({
        method: 'PUT',
        path: '/leads/{id}',
        config: {
            handler: leadController.update,
            // auth: "jwt",
            tags: ['api', 'leads'],
            description: 'update  info a leads',
            validate: {
                headers: user_validator_1.headerModel,
                payload: LeadValidator.updateModel,
                params: {
                    id: Joi
                        .number().
                        required()
                        .example(38)
                        .description('leadid')
                },
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: code_errors_1.MsgCodeResponses.INPUT_INVALID,
                        msg: code_errors_1.MsgCodeResponses.INPUT_INVALID
                    };
                    return reply(res);
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    /**
     * Update a lead
     */
    server.route({
        method: 'PUT',
        path: '/leads/status/{id}',
        config: {
            handler: leadController.updateStatus,
            // auth: "jwt",
            tags: ['api', 'leads'],
            description: 'update status of leads',
            validate: {
                headers: user_validator_1.headerModel,
                payload: LeadValidator.updateStatusModel,
                params: {
                    id: Joi
                        .number().
                        required()
                        .example(38)
                        .description('leadid')
                },
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: code_errors_1.MsgCodeResponses.INPUT_INVALID,
                        msg: code_errors_1.MsgCodeResponses.INPUT_INVALID
                    };
                    index_1.LogLead.create({
                        type: 'updatelead',
                        dataInput: request.payload,
                        msg: 'payload do not valid',
                        meta: {
                            exception: error,
                            response: res
                        },
                    });
                    return reply(res);
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        }
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    /**
     * create new a lead
     */
    server.route({
        method: 'POST',
        path: '/leads',
        config: {
            handler: leadController.create,
            // auth: "jwt",
            tags: ['api', 'leads'],
            description: '#driveKH-lienhe #screen 11Create list lead ',
            validate: {
                payload: LeadValidator.createLeadModel,
                headers: user_validator_1.headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: code_errors_1.MsgCodeResponses.INPUT_INVALID,
                        msg: code_errors_1.MsgCodeResponses.INPUT_INVALID
                    };
                    index_1.LogLead.create({
                        type: 'createlead',
                        dataInput: request.payload,
                        msg: 'payload do not valid',
                        meta: {
                            exception: error,
                            response: res
                        },
                    });
                    return reply(res);
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        }
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map