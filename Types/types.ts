export type Company = {
    id: string;
    companyName: string;
    user: User[];
    workflows: Workflow[];
    ecmBaseURL: string;
    publickey: string;
    userName: string;
    password: string;
    apiKey: string;
    companyEmail: string;
    numberOfDocumentsLeftCurrentPeriod: string;
    numberOfDocumentsUsedCurrentPeriod: string;
    totalNumberOfDocumentsUsed: string;
    nextDocumentRefreshDate: string;
    LastDocumentRefreshDate: string;
    totalDocumentsProcessed: string;
    totalNumberInvoiceProcessed: string;
    companyPlan: "Monthly" | "Yearly" | "Trial" |"Partner";
    companyStatus: string;
    numberOfDocuments: "1000" | "5000" | "10000";
    numberOfDocumentUseInJanuary: string;
    numberOfDocumentUseInFebruary: string;
    numberOfDocumentUseInMarch: string;
    numberOfDocumentUseInApril: string;
    numberOfDocumentUseInMay: string;
    numberOfDocumentUseInJune: string;
    numberOfDocumentUseInJuly: string;
    numberOfDocumentUseInAugust: string;
    numberOfDocumentUseInSeptember: string;
    numberOfDocumentUseInOctober: string;
    numberOfDocumentUseInNovember: string;
    numberOfDocumentUseInDecember: string;
};

export type ModalInfomation = {
    modalType: string;
    title: string;
    modalBody?: React.ReactNode;
    buttonText: string;
}; 

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    role: string;
    password?: string;
    company: Company;
    companyName: string;
};

export type Workflow = {
    cabinetId: string;
    cabinetName: string;
    id: string;
    name: string;
    publishedId: string;
};
export type WorkflowAutomation = {
    id: string;
    name: string;
    interval: string;
    decisionData: DecisionData,
    taskData: TaskData,
    workflowData: WfData,
    conditionSet: ConditionItem[];
};

export type WfData = {
    cabinetId: string,
    cabinetName: string,
    id: string,
    name: string,
    publishedId: string,
};
export type TaskData = {
    id: string,
    name: string,
};
export type DecisionData = {
    id: string,
    name: string,
};
export type ConditionItem = {
  conditionField: string;
  conditionOperator: string;
  conditionValue: string;
  linkOperator: string;
  parenthesisStart: string;
  parenthesisEnd: string;
};

export type IndexField = {
    id: string;
    name: string;
    type: number;
    selectListValues?: SelectListValue[];
};
export type SelectListValue = {
    Guid: string;
    FieldValue: string;
};

export type ECMConnection = {
    ecmBaseURL: string;
    publickey: string;
    userName: string;
    password: string;
    apiKey: string;
};
export type Profile = {
    id: string;
    name: string;
};

