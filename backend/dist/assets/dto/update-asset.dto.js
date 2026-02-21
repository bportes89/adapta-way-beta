"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssetDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_asset_dto_1 = require("./create-asset.dto");
class UpdateAssetDto extends (0, mapped_types_1.PartialType)(create_asset_dto_1.CreateAssetDto) {
}
exports.UpdateAssetDto = UpdateAssetDto;
//# sourceMappingURL=update-asset.dto.js.map