"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const activity_controller_1 = require("./activity-controller");
const ActivitiesValidator = require("./activity-validator");
const HTTP_STATUS = require("http-status");
const index_1 = require("../../mongo/index");
function default_1(server, configs, database) {
    const activitiesController = new activity_controller_1.default(configs, database);
    server.bind(activitiesController);
    // /**
    //  * lấy 1 campaign theo campaignid
    //  */
    // server.route({
    //     method: 'GET',
    //     path: '/campaigns/{id}',
    //     config: {
    //         handler: campaignController.getCampaignById,
    //         auth: "jwt",
    //         tags: ['api', 'campaigns'],
    //         description: 'Get campaigns by id.',
    //         validate: {
    //             params: {
    //                 id: Joi.string().required()
    //             },
    //             headers: jwtValidator
    //         },
    //         plugins: {
    //             'hapi-swagger': {
    //                 responses: {
    //                     '200': {
    //                         'description': 'Campaign founded.'
    //                     },
    //                     '404': {
    //                         'description': 'Campaign does not exists.'
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // });
    /**
     * Tạo mới goal
     */
    server.route({
        method: 'POST',
        path: '/activities',
        config: {
            handler: activitiesController.create,
            // auth: "jwt",
            tags: ['api', 'activities'],
            description: 'Create a activity.',
            validate: {
                payload: ActivitiesValidator.createModel,
                // headers: jwtValidator
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: 'ex_payload', msg: 'payload dont valid',
                            details: error
                        }
                    };
                    index_1.LogActivity.create({
                        type: 'createactivty',
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
                        201: {
                            'description': 'activity created.'
                        }
                    }
                }
            }
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map