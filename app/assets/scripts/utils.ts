export async function sleep(ms: number): Promise<void>{
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function apiRequest(url: string, query_method: any, query_body?: any): Promise<any>{
    if(url.length <= 0) throw "Empty URL"
    const response = await $fetch(
        url,
        {
            method: query_method,
            body: query_body
        }
    );
    return response;    
}


export function checkValidAttributes(registry: any): boolean {
    if (!registry || Object.keys(registry).length === 0) return false;
    return Object.values(registry).every(value => {
        if(value === undefined) return false
        if(typeof value === 'string' && value.trim().length <= 0) return false;
        return true
    });
}

export function pageBack(to?: string): void {
    if(to) useRouter().replace(to);
    else useRouter().back();
}