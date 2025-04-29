export interface RoleDetail {
	id?: number;
	name?: string;
	roleId?: number;
	roleName?: string;
	action?: string;
	hideColumn?: string;
	status?: string;
	dbStatus?: string;
	createDate?: Date;
	updateDate?: Date;
	deleteDate?: Date;
	createById?: number;
	updateById?: number;
	deleteById?: number;
	isDelete?: boolean;
}
