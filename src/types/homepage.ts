export interface HomeCommonData {
    summaryData: SummaryData[];
    topData: UserData[];
    lastData: UserData[];
}

export interface SummaryData {
    total: number;
    maxNo: number;
    minNo: number;
    avgNo: number;
}

export interface UserData {
    id: number;
    name: string;
    emailId:string;
}

export interface HtmlDataItem {
    name: string;
    html: string;
}

export interface ListHtmlData {
    htmlData: HtmlDataItem[];
}

export interface HomeUserData {
    id: number;
    name: string;
    emailId:string;
}
