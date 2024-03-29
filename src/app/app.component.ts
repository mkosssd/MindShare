import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core'
import { AuthService } from './auth/auth.service'
import { PostsService } from './home/posts.service'
import { DOCUMENT, isPlatformBrowser } from '@angular/common'
import { NavigationEnd, Router } from '@angular/router'
import { filter, pluck, tap } from 'rxjs'
import { Meta } from '@angular/platform-browser'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MindShare'
  constructor (
    public auth: AuthService,
    private posts: PostsService,
    @Inject(PLATFORM_ID) private plateformId: any,
	@Inject(DOCUMENT) private _dom: Document,
	private router: Router,
	private meta: Meta
  ) {}
  ngOnInit (): void {
    if (isPlatformBrowser(this.plateformId)) {
      this.auth.autoLogin()
      this.posts.getPosts().subscribe()
    }
	this.router.events
	.pipe(
		filter(event => event instanceof NavigationEnd),
		pluck('urlAfterRedirects'),
		tap((data: string | unknown) => {

			const fullUrl = this._dom.URL
			let url = fullUrl.split("?")[0].replace(/\/$/, "");
			if (!url.includes('https://'))
				url = url.replace('http://', 'https://')

			this.meta.updateTag({ property: 'og:url', content: url });

			this.meta.updateTag({ name: 'robots', content: 'index, follow, noodp' });

			// this.metaService.createCanonicalURL();

			if (!fullUrl.includes("?")) {

				// check canonical exists or not
				const canonicalEle = this._dom.querySelector('link[rel="canonical"]');

				if (canonicalEle)
					canonicalEle.setAttribute("href", url)
				else {
					let link: HTMLLinkElement = this._dom.createElement('link');
					link.setAttribute('rel', 'canonical');
					link.setAttribute('href', url);
					this._dom.head.appendChild(link);
				}

			} else {
				this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
			}
		})
	).subscribe();
      // add site meta for image
	  this.meta.updateTag({ property: 'og:site_name', content: 'mindshare.social' });
	  this.meta.updateTag({ property: 'og:type', content: 'website' });
	  this.meta.updateTag({ property: 'og:image', content: `https://firebasestorage.googleapis.com/v0/b/mindshare-3ab39.appspot.com/o/MindShare-logo.webp?alt=media&token=e090bf8e-5fe7-42cf-8eba-711ac15bbc75` });

	  this.meta.updateTag({ property: 'twitter:site', content: '@Mindshare_IND' });
	  this.meta.updateTag({ property: 'twitter:card', content: 'summary_large_image' });
	  this.meta.updateTag({ property: 'twitter:image', content: 'https://firebasestorage.googleapis.com/v0/b/mindshare-3ab39.appspot.com/o/MindShare-logo.webp?alt=media&token=e090bf8e-5fe7-42cf-8eba-711ac15bbc75' });
  }
  
}
