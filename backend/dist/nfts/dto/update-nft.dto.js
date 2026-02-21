"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNftDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_nft_dto_1 = require("./create-nft.dto");
class UpdateNftDto extends (0, mapped_types_1.PartialType)(create_nft_dto_1.CreateNftDto) {
}
exports.UpdateNftDto = UpdateNftDto;
//# sourceMappingURL=update-nft.dto.js.map