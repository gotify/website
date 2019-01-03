const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
    render() {
        const {siteConfig, language = ''} = this.props;
        const {baseUrl, docsUrl} = siteConfig;
        const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
        const langPart = `${language ? `${language}/` : ''}`;
        const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

        const SplashContainer = props => (
            <div className="homeContainer">
                <div className="homeSplashFade">
                    <div className="wrapper homeWrapper">{props.children}</div>
                </div>
            </div>
        );

        const Logo = () => (
            <div className="projectLogo">
                <img src={baseUrl + 'img/logo.png'} alt="Project Logo"/>
            </div>
        );

        const ProjectTitle = () => (
            <h2 className="projectTitle">
                {siteConfig.title}
                <small>{siteConfig.tagline}</small>
            </h2>
        );

        const PromoSection = props => (
            <div className="section promoSection">
                <div className="promoRow">
                    <div className="pluginRowBlock">{props.children}</div>
                </div>
            </div>
        );

        const Button = props => (
            <div className="pluginWrapper buttonWrapper">
                <a className="button" href={props.href} target={props.target}>
                    {props.children}
                </a>
            </div>
        );

        return (
            <SplashContainer>
                <Logo/>
                <div className="inner">
                    <ProjectTitle siteConfig={siteConfig}/>
                    <PromoSection>
                        <Button href="https://github.com/gotify/server/releases/latest">Download</Button>
                        <Button href={docUrl('index')}>Documentation</Button>
                        <Button href="https://github.com/gotify">SourceCode</Button>
                    </PromoSection>
                </div>
            </SplashContainer>
        );
    }
}

class Index extends React.Component {
    render() {
        const {config: siteConfig, language = ''} = this.props;
        const {baseUrl} = siteConfig;

        const Block = props => (
            <Container
                padding={['bottom', 'top']}
                id={props.id}
                background={props.background}>
                <GridBlock
                    align="center"
                    contents={props.children}
                    layout={props.layout}
                />
            </Container>
        );

        const TextBlock = props => (
            <Container
                padding={['bottom', 'top']}
                id={props.id}
                background={props.background}>
                <GridBlock
                    contents={props.children}
                    layout={props.layout}
                />
            </Container>
        );

        const SlashAndroid = () => (
            <TextBlock>
                {[
                    {
                        content: `an android client for subscribing to the message stream of gotify/server.
The app creates push notification on newly received messages.

[<img src="img/playstore.png" alt="Get it on Google Play" width="150" />](https://play.google.com/store/apps/details?id=com.github.gotify)
[<img src="img/fdroid.png" alt="Get it on F-Droid" width="150"/>](https://f-droid.org/de/packages/com.github.gotify/)
[<img src="img/download-badge.png" alt="Get it on F-Droid" width="150"/>](https://github.com/gotify/android/releases/latest)

*Google Play and the Google Play logo are trademarks of Google LLC.*`,
                        image: `${baseUrl}img/androidv2.png`,
                        imageAlign: 'left',
                        title: '[gotify/android](https://github.com/gotify/android)',
                    },
                ]}
            </TextBlock>
        );

        const SlashCLI = () => (
            <TextBlock background="light">
                {[
                    {
                        content: `a command line client for pushing messages to gotify/server. It is **not** required to push messages. See Docs.`,
                        title: '[gotify/cli](https://github.com/gotify/cli)',
                    },
                ]}
            </TextBlock>
        );

        const SlashServer = () => (
            <TextBlock background="light">
                {[
                    {
                        content: `The heart of this project. gotify/server features a WebUI and functionality for:
* sending messages via a REST-API
* subscribing/receiving messages via a web socket connection
* managing users, clients and applications`,
                        image: `${baseUrl}img/ui.png`,
                        imageAlign: 'right',
                        title: '[gotify/server](https://github.com/gotify/server)',
                    },
                ]}
            </TextBlock>
        );

        const Features = () => (
            <Block layout="threeColumn">
                {[
                    {
                        title: 'Self Hosted',
                        content: 'You control your data.',
                    },
                    {
                        title: 'Free and open source',
                        content: 'Gotify is licensed under the [MIT license](https://github.com/gotify/server/blob/master/LICENSE).',
                    },
                    {
                        title: 'Simple',
                        content: 'Both Gotify\'s API and user interface is designed to be as simple as possible.',
                    },
                    {
                        title: 'Cross Platform',
                        content: 'Gotify is written in Go and can be easily compiled for different platforms.',
                    },
                    {
                        title: 'Docker',
                        content: 'Docker images are automatically built on every release.',
                    },
                    {
                        title: 'Code Quality / Tests',
                        content: 'Several static code analyzers and many unit/end2end tests are run on every travis-ci build.',
                    },
                ]}
            </Block>
        );

        return (
            <div>
                <HomeSplash siteConfig={siteConfig} language={language}/>
                <div className="mainContainer">
                    <Features/>
                    <SlashServer/>
                    <SlashAndroid/>
                    <SlashCLI/>
                </div>
            </div>
        );
    }
}

module.exports = Index;
