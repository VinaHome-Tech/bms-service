import { DTO_RQ_UserAction } from 'src/utils/user.dto';
import { DTO_RP_Office, DTO_RQ_Office } from './office.dto';
import { Office } from './office.entity';
import { OfficePhone } from './office_phone.entity';

export class OfficeMapper {
  static toDTO(office: Office): DTO_RP_Office {
    return {
      id: office.id,
      name: office.name,
      code: office.code,
      address: office.address,
      note: office.note,
      status: office.status,
      created_at: office.created_at,
      phones: (office.phones || []).map((phone) => ({
        id: phone.id,
        phone: phone.phone,
        type: phone.type,
      })),
    };
  }

  static toCreateEntity(
    user: DTO_RQ_UserAction,
    data_create: DTO_RQ_Office,
  ): Office {
    const office = new Office();
    office.name = data_create.name;
    office.code = data_create.code;
    office.address = data_create.address;
    office.note = data_create.note;
    office.status = data_create.status;
    office.company_id = user.company_id;
    if (data_create.phones?.length) {
      office.phones = data_create.phones.map((p) => {
        const phone = new OfficePhone();
        phone.phone = p.phone;
        phone.type = p.type;
        phone.office = office;
        return phone;
      });
    }
    return office;
  }
}
