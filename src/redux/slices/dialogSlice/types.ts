export type NativeDialogContent = {
    title: string;
    body: string;
    options: any;
    slug: string;
    onDismiss: (slug: string, option: any) => void;
};
