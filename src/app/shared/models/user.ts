export class User {
  constructor(
    public id?: string,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public role?: string,
    public base_company?: string,
    public token?: string,
    public status?: boolean,
    public user_id?: string
  ) { }
}

export class UserDetail {
  constructor(
    public id?: string,
    public username?: string,
    public first_name?: string,
    public last_name?: string,
    public email?: string,
    public phone_number?: string,
    public date_of_birth?: string,
    public company?: Company[],
    public default_company?: any[]
  ) { }
}

export class Company {
  constructor(
    public id?: string,
    public company_code?: string,
    public company_name?: string,
    public address_id?: string,
    public is_active?: boolean,
    public create_by?: string,
    public edit_by?: string,
    public create_date?: string,
    public edit_date?: string,
    public display_name?: string,
    public client_secret?: string,
    public client_key?: string,
    public parent_company_id?: string,
    public is_cod?: boolean,
    public is_do?: boolean,
  ) { }
}