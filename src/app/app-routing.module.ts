import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SprintFormComponent } from './sprint-form/sprint-form.component';
import { StoryFormComponent } from './story-form/story-form.component';
import { StoryListComponent } from './story-list/story-list.component';

const routes: Routes = [
  {
   path: '',
   redirectTo: 'story-list',
   pathMatch: 'full'
  },
  {
    path: 'story-list',
    component: StoryListComponent
  },
  {
    path: 'create-story',
    component: StoryFormComponent
  },
  {
    path: 'edit-story/:id',
    component: StoryFormComponent
  },
  {
    path: 'sprint-form',
    component: SprintFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],    
  exports: [RouterModule]
})
export class AppRoutingModule { }
