import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticlePage } from './article.page';

describe('ArticlePage', () => {
  let component: ArticlePage;
  let fixture: ComponentFixture<ArticlePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ArticlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
