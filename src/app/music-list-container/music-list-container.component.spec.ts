import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicListContainerComponent } from './music-list-container.component';

describe('MusicListContainerComponent', () => {
  let component: MusicListContainerComponent;
  let fixture: ComponentFixture<MusicListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MusicListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
