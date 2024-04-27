export interface AdditionalInfo {
    adDuplicates: number;
    adUnique: number;
    brandName: string;
    brandLogoUrl: string;
    adOnPlateformUrl: string;
    adOnplateformImageUrl: string;
    landingPageUrl: string;
    landingPageImageUrl: string;
}
export interface AdsLibrarySearchParams {
    access_token: string;
    ad_active_status?: 'ACTIVE' | 'ALL' | 'INACTIVE';
    ad_delivery_date_max?: string;
    ad_delivery_date_min?: string;
    ad_reached_countries: CountryCode[];
    ad_type?: 'ALL' | 'CREDIT_ADS' | 'EMPLOYMENT_ADS' | 'HOUSING_ADS' | 'POLITICAL_AND_ISSUE_ADS';
    bylines?: string[];
    delivery_by_region?: string[];
    estimated_audience_size_max?: number;
    estimated_audience_size_min?: number;
    languages?: string[];
    media_type?: 'ALL' | 'IMAGE' | 'MEME' | 'VIDEO' | 'NONE';
    publisher_platforms?: ('FACEBOOK' | 'INSTAGRAM' | 'AUDIENCE_NETWORK' | 'MESSENGER' | 'WHATSAPP' | 'OCULUS')[];
    search_page_ids?: number[];
    search_terms?: string;
    search_type?: 'KEYWORD_UNORDERED' | 'KEYWORD_EXACT_PHRASE';
    unmask_removed_content?: boolean;
    fields: string;
}
export interface DedupLandingPageUrl {
    uniqueLandingPageUrl: string[];
    uniqueLandingPageUrlLength: number;
    duplicatedLandingPageUrlLength: number;
}
export interface PromptInput {
    bestAds: TransformedAd[];
    uniqueLandingPageUrl: DedupLandingPageUrl;
}
export interface LandingPageUrlFromAd {
    callToActionUrl: string;
    ad_id: string;
}
export interface TransformedAd {
    id?: string;
    ad_creation_time: string;
    ad_creative_bodies?: string;
    ad_creative_link_captions?: string;
    ad_creative_link_titles?: string;
    ad_delivery_start_time: string;
    ad_snapshot_url?: string;
    age_country_gender_reach_breakdown: any[];
    beneficiary_payers: any[];
    eu_total_reach: number;
    languages?: string;
    page_id?: string;
    page_name: string;
    publisher_platforms: string[];
    target_ages: string[];
    target_gender: string;
    target_locations: any[];
    creative_src: string;
    full_ad_src: string;
    callToActionUrl: string;
    landing_page_src: string;
}
export interface GetRawAds {
    ads: any;
    best_ads_limit: number;
    brandName: string;
}
export interface ProcessedAds {
    ads: {
        data: TransformedAd[];
        bestAdId: string | null;
        bestAdScore: number;
        secondBestAdId: string | null;
        secondBestAdScore: number;
        nextPage: string;
    };
}
export interface AgeCountryGenderReachBreakdown {
}
export interface BeneficiaryPayer {
}
export interface AudienceDistribution {
}
export interface InsightsRangeValue {
}
export interface TargetLocation {
}
export interface AdFirstResponse {
    data: AdResponse[];
    paging: {
        next?: string;
        cursors?: {
            after?: string;
        };
    };
}
export interface GPTads {
    ad_creative_bodies: string;
    age_country_gender_reach_breakdown: any[];
    eu_total_reach: number;
    publisher_platforms: string[];
    target_ages: string[];
    target_gender: string;
    target_locations: any[];
    creative_src: string;
    full_ad_src: string;
    landing_page_src: string;
    ad_delivery_start_time: string;
}
export interface AdResponse {
    id: string;
    ad_creation_time: string;
    ad_creative_bodies: string[];
    ad_creative_link_captions: string[];
    ad_creative_link_descriptions: string[];
    ad_creative_link_titles: string[];
    ad_delivery_start_time: string;
    ad_delivery_stop_time: string;
    ad_snapshot_url: string;
    age_gender_breakdowns: any;
    age_country_gender_reach_breakdown: any;
    beneficiary_payers: any;
    bylines: string;
    currency: string;
    delivery_by_region: any;
    demographic_distribution: any;
    estimated_audience_size: any;
    eu_total_reach: number;
    impressions: any;
    languages: string[];
    page_id: string;
    page_name: string;
    publisher_platforms: string[];
    spend: any;
    target_ages: string[];
    target_gender: 'Women' | 'Men' | 'All';
    target_locations: any;
}
export declare enum CountryCode {
    ALL = "ALL",
    BR = "BR",
    IN = "IN",
    GB = "GB",
    US = "US",
    CA = "CA",
    AR = "AR",
    AU = "AU",
    AT = "AT",
    BE = "BE",
    CL = "CL",
    CN = "CN",
    CO = "CO",
    HR = "HR",
    DK = "DK",
    DO = "DO",
    EG = "EG",
    FI = "FI",
    FR = "FR",
    DE = "DE",
    GR = "GR",
    HK = "HK",
    ID = "ID",
    IE = "IE",
    IL = "IL",
    IT = "IT",
    JP = "JP",
    JO = "JO",
    KW = "KW",
    LB = "LB",
    MY = "MY",
    MX = "MX",
    NL = "NL",
    NZ = "NZ",
    NG = "NG",
    NO = "NO",
    PK = "PK",
    PA = "PA",
    PE = "PE",
    PH = "PH",
    PL = "PL",
    RU = "RU",
    SA = "SA",
    RS = "RS",
    SG = "SG",
    ZA = "ZA",
    KR = "KR",
    ES = "ES",
    SE = "SE",
    CH = "CH",
    TW = "TW",
    TH = "TH",
    TR = "TR",
    AE = "AE",
    VE = "VE",
    PT = "PT",
    LU = "LU",
    BG = "BG",
    CZ = "CZ",
    SI = "SI",
    IS = "IS",
    SK = "SK",
    LT = "LT",
    TT = "TT",
    BD = "BD",
    LK = "LK",
    KE = "KE",
    HU = "HU",
    MA = "MA",
    CY = "CY",
    JM = "JM",
    EC = "EC",
    RO = "RO",
    BO = "BO",
    GT = "GT",
    CR = "CR",
    QA = "QA",
    SV = "SV",
    HN = "HN",
    NI = "NI",
    PY = "PY",
    UY = "UY",
    PR = "PR",
    BA = "BA",
    PS = "PS",
    TN = "TN",
    BH = "BH",
    VN = "VN",
    GH = "GH",
    MU = "MU",
    UA = "UA",
    MT = "MT",
    BS = "BS",
    MV = "MV",
    OM = "OM",
    MK = "MK",
    LV = "LV",
    EE = "EE",
    IQ = "IQ",
    DZ = "DZ",
    AL = "AL",
    NP = "NP",
    MO = "MO",
    ME = "ME",
    SN = "SN",
    GE = "GE",
    BN = "BN",
    UG = "UG",
    GP = "GP",
    BB = "BB",
    AZ = "AZ",
    TZ = "TZ",
    LY = "LY",
    MQ = "MQ",
    CM = "CM",
    BW = "BW",
    ET = "ET",
    KZ = "KZ",
    NA = "NA",
    MG = "MG",
    NC = "NC",
    MD = "MD",
    FJ = "FJ",
    BY = "BY",
    JE = "JE",
    GU = "GU",
    YE = "YE",
    ZM = "ZM",
    IM = "IM",
    HT = "HT",
    KH = "KH",
    AW = "AW",
    PF = "PF",
    AF = "AF",
    BM = "BM",
    GY = "GY",
    AM = "AM",
    MW = "MW",
    AG = "AG",
    RW = "RW",
    GG = "GG",
    GM = "GM",
    FO = "FO",
    LC = "LC",
    KY = "KY",
    BJ = "BJ",
    AD = "AD",
    GD = "GD",
    VI = "VI",
    BZ = "BZ",
    VC = "VC",
    MN = "MN",
    MZ = "MZ",
    ML = "ML",
    AO = "AO",
    GF = "GF",
    UZ = "UZ",
    DJ = "DJ",
    BF = "BF",
    MC = "MC",
    TG = "TG",
    GL = "GL",
    GA = "GA",
    GI = "GI",
    CD = "CD",
    KG = "KG",
    PG = "PG",
    BT = "BT",
    KN = "KN",
    SZ = "SZ",
    LS = "LS",
    LA = "LA",
    LI = "LI",
    MP = "MP",
    SR = "SR",
    SC = "SC",
    VG = "VG",
    TC = "TC",
    DM = "DM",
    MR = "MR",
    AX = "AX",
    SM = "SM",
    SL = "SL",
    NE = "NE",
    CG = "CG",
    AI = "AI",
    YT = "YT",
    CV = "CV",
    GN = "GN",
    TM = "TM",
    BI = "BI",
    TJ = "TJ",
    VU = "VU",
    SB = "SB",
    ER = "ER",
    WS = "WS",
    AS = "AS",
    FK = "FK",
    GQ = "GQ",
    TO = "TO",
    KM = "KM",
    PW = "PW",
    FM = "FM",
    CF = "CF",
    SO = "SO",
    MH = "MH",
    VA = "VA",
    TD = "TD",
    KI = "KI",
    ST = "ST",
    TV = "TV",
    NR = "NR",
    RE = "RE",
    LR = "LR",
    ZW = "ZW",
    CI = "CI",
    MM = "MM",
    AN = "AN",
    AQ = "AQ",
    BQ = "BQ",
    BV = "BV",
    IO = "IO",
    CX = "CX",
    CC = "CC",
    CK = "CK",
    CW = "CW",
    TF = "TF",
    GW = "GW",
    HM = "HM",
    XK = "XK",
    MS = "MS",
    NU = "NU",
    NF = "NF",
    PN = "PN",
    BL = "BL",
    SH = "SH",
    MF = "MF",
    PM = "PM",
    SX = "SX",
    GS = "GS",
    SS = "SS",
    SJ = "SJ",
    TL = "TL",
    TK = "TK",
    UM = "UM",
    WF = "WF",
    EH = "EH"
}
export declare enum SubfolderOptions {
    facebook_creative = "facebook_creative/",
    facebook_landing_page = "facebook_landing_page/"
}
export interface ChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    system_fingerprint: string;
    choices: Choice[];
    usage: Usage;
    error?: {
        message: string;
        type: string;
        param: string;
        code: string;
    };
}
export interface Choice {
    index: number;
    message: MessageResponse;
    logprobs: null;
    finish_reason: string;
}
export interface MessageResponse {
    content: string;
}
export interface Usage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}
export interface InputMessageType {
    type: string;
    text?: string;
    image_url?: {
        url: string;
    };
}
export interface TextContent {
    type: "text";
    text: string;
}
export interface ImageContent {
    type: "image_url";
    image_url: {
        url: string;
    };
}
export type Content = TextContent | ImageContent;
export interface MessagePayload {
    role: string;
    content: Content[];
}
export interface GPTPayload {
    model: string;
    messages: MessagePayload[];
    max_tokens: number;
    temperature: number;
}
