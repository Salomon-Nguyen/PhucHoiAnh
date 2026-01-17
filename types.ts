
export enum PhotoType {
  PORTRAIT = 'Chân dung',
  FAMILY = 'Gia đình',
  HISTORY = 'Lịch sử',
  WORSHIP = 'Ảnh thờ'
}

export enum OutputMode {
  BW = 'Ảnh Đen Trắng',
  STUDIO = 'Tô Màu Studio',
  REMOVE_BG = 'Xóa nền',
  SUPER_RES = 'Siêu phân giải 8K'
}

export interface RestorationConfig {
  type: PhotoType;
  mode: OutputMode;
  description: string;
}
