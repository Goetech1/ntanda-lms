"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAcademicSessionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_academic_session_dto_1 = require("./create-academic-session.dto");
class UpdateAcademicSessionDto extends (0, mapped_types_1.PartialType)(create_academic_session_dto_1.CreateAcademicSessionDto) {
}
exports.UpdateAcademicSessionDto = UpdateAcademicSessionDto;
//# sourceMappingURL=update-academic-session.dto.js.map