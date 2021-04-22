import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicSeekerComponent } from './music-seeker.component';

describe('MusicSeekerComponent', () => {
  let component: MusicSeekerComponent;
  let fixture: ComponentFixture<MusicSeekerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MusicSeekerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicSeekerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
