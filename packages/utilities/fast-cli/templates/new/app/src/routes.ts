import { RouterConfiguration } from '@microsoft/fast-router';
import { pageLayout } from './layouts/page-layout';
import { HomeScreen } from './home/home';
import { AboutScreen } from './about/about';
import { NotFound } from './not-found';

HomeScreen;
AboutScreen;

type RouteSettings = {
    public?: boolean;
};

export class MainRouterConfig extends RouterConfiguration<RouteSettings> {
    public configure() {
        this.title = 'MyApp';
        this.defaultLayout = pageLayout;
        this.routes.map(
            { path: '', redirect: 'home' },
            { path: 'home', element: HomeScreen, title: 'Home', name: 'home' },
            { path: 'about', element: AboutScreen, title: 'About', name: 'about' },
            { path: 'not-found', element: NotFound, title: "Not Found" },
        )
        this.routes.fallback(
            { redirect: 'not-found' }
        )
    }

}
