import * as Hapi from "hapi";
import * as Boom from "boom";
import * as moment from "moment";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { LeadService, ILead } from '../../services/lead.service';
import * as HTTP_STATUS from 'http-status';
import { createLeadModel } from './lead-validator';
import { LogLead } from "../../mongo/index";
import { IPayloadUpdate } from "./lead";
import { SlackAlert, ManulifeErrors as Ex } from "../../helpers/index";
export default class LeadController {

    private database: IDatabase;
    private configs: IServerConfigurations;
    constructor(configs: IServerConfigurations, database: IDatabase) {
        this.configs = configs;
        this.database = database;
    }

    public async findById(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let idEvent = parseInt(request.params.id, 10);
            let lead: any = await LeadService.findById(idEvent);
            if (lead == null) {
                return reply({
                    status: HTTP_STATUS.NOT_FOUND,
                    data: null,
                }).code(HTTP_STATUS.NOT_FOUND);
            } else {
                return reply({
                    status: HTTP_STATUS.OK,
                    data: lead,
                }).code(HTTP_STATUS.OK);
            }
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: {
                        code: Ex.EX_GENERAL,
                        msg: 'find lead have errors'
                    }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogLead.create({
                type: 'findById',
                dataInput: {
                    params: request.params
                },
                msg: 'errors',
                meta: {
                    exception: ex,
                    response: res
                },
            });
            reply(res).code(HTTP_STATUS.BAD_REQUEST);
        }
    }



    public async detail(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let idEvent = parseInt(request.params.id, 10);
            let lead: any = await LeadService.detailLeadActivity(idEvent);
            if (lead == null) {
                return reply({
                    status: HTTP_STATUS.NOT_FOUND,
                    data: lead
                }).code(HTTP_STATUS.NOT_FOUND);
            } else {
                return reply({
                    status: HTTP_STATUS.OK,
                    data: lead
                }).code(HTTP_STATUS.OK);
            }
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: { code: Ex.EX_GENERAL, msg: 'find lead have errors' }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogLead.create({
                type: 'detail lead',
                dataInput: {
                    params: request.params
                },
                msg: 'errors',
                meta: {
                    exception: ex,
                    response: res
                },
            });
            reply(res).code(HTTP_STATUS.BAD_REQUEST);
        }
    }


    /**
     * create lead
     * @param request  payload
     * @param reply lead
     */
    public async update(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let id = parseInt(request.params.id, 10);
            let payload = request.payload as IPayloadUpdate;
            let lead: any = await LeadService.update(id, payload);
            // log mongo create success
            LogLead
                .create({
                    type: 'create',
                    msg: 'success',
                    dataInput: request.payload,
                    meta: {
                        lead: lead.dataValues
                    }
                });
            reply({
                status: HTTP_STATUS.OK,
                data: lead
            }).code(HTTP_STATUS.OK);
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: { code: Ex.EX_GENERAL, msg: 'Create lead have errors' }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogLead.create({
                type: 'update lead',
                dataInput: {
                    payload: request.payload,
                    params: request.params
                },
                msg: 'errors',
                meta: {
                    exception: ex,
                    response: res
                },
            });
            reply(res).code(HTTP_STATUS.BAD_REQUEST);
        }
    }

    /**
     * create lead
     * @param request  payload
     * @param reply lead
     */
    public async create(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let iLead = request.payload as ILead;
            let lead: any = await LeadService.create(iLead)
                .catch(ex => {
                    throw ex;
                });
            // log mongo create success
            reply({
                status: HTTP_STATUS.OK,
                data: lead
            }).code(HTTP_STATUS.OK);
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: { code: 'ex', msg: 'Create lead have errors' }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogLead.create({
                type: 'create lead',
                dataInput: request.payload,
                msg: 'errors',
                meta: {
                    exception: ex,
                    response: res
                },
            });
            reply(res).code(HTTP_STATUS.BAD_REQUEST);
        }
    }


}
