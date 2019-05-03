import { Component, AfterViewInit, Input } from '@angular/core';

@Component({
    selector: 'jhi-tweet',
    template: `
        <a
            href="https://twitter.com/share"
            [attr.data-text]="text"
            [attr.data-url]="url"
            class="twitter-share-button"
            data-hashtags="Thorneo"
        ></a>
    `
})
export class TweetComponent implements AfterViewInit {
    @Input() url = location.href;
    @Input() text = '';

    constructor() {
        // load twitter sdk if required
        const url = 'https://platform.twitter.com/widgets.js';
        if (!document.querySelector(`script[src='${url}']`)) {
            const script = document.createElement('script');
            script.src = url;
            document.body.appendChild(script);
        }
    }

    ngAfterViewInit(): void {
        // render tweet button
        const b = !(!window['twttr'].widgets.load() || !window['twttr']);
    }
}
