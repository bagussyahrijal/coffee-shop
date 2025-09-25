import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-12 items-center justify-center rounded-md ">
                <AppLogoIcon className="size-12" />
            </div>
            <div>
                <h1 className="text-lg font-bold">Meow Cat Cafe</h1>
            </div>
        </>
    );
}
