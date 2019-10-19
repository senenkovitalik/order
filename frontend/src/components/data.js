export const addressData = [
  { field: 'region', title: 'Область' },
  { field: 'city', title: 'Місто' },
  { field: 'district', title: 'Район' },
  { field: 'urbanVillage', title: 'Селище міського типу' },
  { field: 'village', title: 'Село' },
  { field: 'street', title: 'Вулиця' },
  { field: 'houseNumber', title: 'Будинок №' },
  { field: 'apartmentNumber', title: 'Квартира №' }
];

export const monthes = [
  {name: "січень", days: 31},
  {name: "лютий", days: 28},
  {name: "березень", days: 31},
  {name: "квітень", days: 30},
  {name: "травень", days: 31},
  {name: "червень", days: 30},
  {name: "липень", days: 31},
  {name: "серпень", days: 31},
  {name: "вересень", days: 30},
  {name: "жовтень", days: 31},
  {name: "листопад", days: 30},
  {name: "грудень", days: 31}
];

export const dutyMapping = {
  '111': {
    className: 'cell_used-full',
    content: ''
  },
  '110': {
    className: 'cell_used-partly',
    content: '1/2'
  },
  '100': {
    className: 'cell_used-partly',
    content: '1'
  },
  '101': {
    className: 'cell_used-partly',
    content: '1/3'
  },
  '011': {
    className: 'cell_used-partly',
    content: '2/3'
  },
  '001': {
    className: 'cell_used-partly',
    content: '3'
  },
  '010': {
    className: 'cell_used-partly',
    content: '2'
  },
};