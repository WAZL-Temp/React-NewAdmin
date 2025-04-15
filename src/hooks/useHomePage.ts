import { CarouselResponsiveOption, NavigateFunction } from "../sharedBase/globalImports";

export const responsiveOptions: CarouselResponsiveOption[] = [
    { breakpoint: "1400px", numVisible: 3, numScroll: 1 },
    { breakpoint: "1024px", numVisible: 3, numScroll: 1 },
    { breakpoint: "768px", numVisible: 2, numScroll: 1 },
    { breakpoint: "560px", numVisible: 1, numScroll: 1 },
];

export function useHomePage() {
    const renderHtmlContent = (item: any, type: string): string => {        
        if (item.name === type) {
            return item.html;
        }
        return '';
    };

    const handleUserView = (navigate: NavigateFunction, userid: any, modelType: string) => {
        navigate(`/${modelType}/${userid}`);
    };

    const handleUserEdit = (navigate: NavigateFunction, userid: any, modelType: string) => {
        navigate(`/${modelType}/edit/${userid}`);
    };

    return {
        responsiveOptions,
        renderHtmlContent,
        handleUserView,
        handleUserEdit
    }
}
