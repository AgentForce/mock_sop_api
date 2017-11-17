import * as Joi from "joi";
const createCampaignFAModel = Joi.object().keys({
    CampType: Joi.number().valid([1, 2]).required(),
    Name: Joi.string().required(),
    Label: Joi.string().valid(['fc', 'fa']).required(),
    Experience: Joi.string().valid(['old', 'new']).required(),
    UserId: Joi.number().required(),
    StartDate: Joi.date().required(),
    EndDate: Joi.date().required(),
    CaseSize: Joi.number().min(1).required(),
    IncomeMonthly: Joi.number().required(),
    CommissionRate: Joi.number().required()
});

export { createCampaignFAModel };