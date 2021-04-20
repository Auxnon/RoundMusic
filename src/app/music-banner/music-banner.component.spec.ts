import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicBannerComponent } from './music-banner.component';

describe('MusicBannerComponent', () => {
  let component: MusicBannerComponent;
  let fixture: ComponentFixture<MusicBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MusicBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
