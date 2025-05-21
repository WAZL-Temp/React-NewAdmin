import { CarouselResponsiveOption, NavigateFunction } from "../sharedBase/globalImports";
import { HtmlDataItem } from "../types/homepage";

export const responsiveOptions: CarouselResponsiveOption[] = [
    { breakpoint: "1400px", numVisible: 3, numScroll: 1 },
    { breakpoint: "1024px", numVisible: 1, numScroll: 1 },
    { breakpoint: "768px", numVisible: 1, numScroll: 1 },
    { breakpoint: "560px", numVisible: 1, numScroll: 1 },
];

export function useHomePage() {
    const renderHtmlContent = (item: HtmlDataItem, type: string): string => {        
        if (item.name === type) {
            return item.html;
        }
        return '';
    };

    const handleUserView = (navigate: NavigateFunction, userid: string | number, modelType: string) => {
        navigate(`/${modelType}/${userid}`);
    };

    const handleUserEdit = (navigate: NavigateFunction, userid: string | number, modelType: string) => {
        navigate(`/${modelType}/edit/${userid}`);
    };

    return {
        responsiveOptions,
        renderHtmlContent,
        handleUserView,
        handleUserEdit
    }
}
