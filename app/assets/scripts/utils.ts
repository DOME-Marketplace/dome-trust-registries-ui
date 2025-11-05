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

export function makeCursorWait(): void{
    document.body.classList.add("waiting");
}

export function stopCursorWaiting(): void{
    document.body.classList.remove("waiting");
}

export function trimArray(array: string[]): string[] {
    return array.map(item => item.trim()).filter(item => item.length > 0);
}

export function removeItemAt<T>(index: number, array: T[]): T[]{
    try {
        if(array.length == 0) throw 'Empty array';
        if(index > array.length) throw 'Index (' + index + ') cannot greater than array length (' + array.length + ')'; 
        const copy = array.slice();
        copy.splice(index,1)
        return copy;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export function formatStringToDate(value: string | undefined): string | undefined{
    if (!value) return
    try{
        return value.split('T').at(0);
    } catch (error) {
        console.error(error)
    }
}

export function formatStringToISO(value: string | undefined): string | undefined{
    if (!value) return
    try{
        return new Date(value + 'T00:00:00Z').toISOString()
    } catch (error) {
        console.error(error)
    }
}