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
            let events: any = await LeadService.findById(idEvent);
            if (events == null) {
                return reply(events).code(HTTP_STATUS.NOT_FOUND);
            } else {
                return reply(events).code(HTTP_STATUS.OK);
            }
        } catch (error) {
            return reply({
                status: 400,
                error: error
            }).code(HTTP_STATUS.BAD_REQUEST);
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
                    error: ex
                };
            } else {
                console.log(ex);
                res = {
                    status: 400,
                    error: { code: 'ex', msg: 'find lead have errors' }
                };
            }
            LogLead.create({
                type: 'detaillead',
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
            this.database.logLead
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
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    error: { code: 'ex', msg: 'Create lead have errors' }
                };
            }
            LogLead.create({
                type: 'updatelead',
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
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    error: { code: 'ex', msg: 'Create lead have errors' }
                };
            }
            LogLead.create({
                type: 'createlead',
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
