export const milliseconds = (n: number) => n;
export const seconds = (n: number) => milliseconds(n * 1000);
export const minutes = (n: number) => seconds(n * 60);
export const hours = (n: number) => minutes(n * 60);
export const days = (n: number) => hours(n * 24);
