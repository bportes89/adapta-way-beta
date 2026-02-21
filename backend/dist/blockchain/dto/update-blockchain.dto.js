"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlockchainDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_blockchain_dto_1 = require("./create-blockchain.dto");
class UpdateBlockchainDto extends (0, mapped_types_1.PartialType)(create_blockchain_dto_1.CreateBlockchainDto) {
}
exports.UpdateBlockchainDto = UpdateBlockchainDto;
//# sourceMappingURL=update-blockchain.dto.js.map