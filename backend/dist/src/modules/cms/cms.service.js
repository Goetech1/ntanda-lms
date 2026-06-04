"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsService = void 0;
const common_1 = require("@nestjs/common");
let CmsService = class CmsService {
    async getPages(tenantId) {
        return { success: true, data: [{ id: 'page-1', title: 'Home' }] };
    }
    async createBlog(tenantId, blogData) {
        return { success: true, data: { id: 'blog-1', ...blogData } };
    }
    async captureLead(tenantId, leadData) {
        return { success: true, message: 'Lead captured successfully' };
    }
};
exports.CmsService = CmsService;
exports.CmsService = CmsService = __decorate([
    (0, common_1.Injectable)()
], CmsService);
//# sourceMappingURL=cms.service.js.map