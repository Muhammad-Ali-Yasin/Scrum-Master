import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { StorySprintService } from '../service/story-sprint.service';
import { GeneratedSprintComponent } from '../generated-sprint/generated-sprint.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-sprint-form',
  templateUrl: './sprint-form.component.html',
  styleUrls: ['./sprint-form.component.sass']
})
export class SprintFormComponent implements OnInit {
  formDirective: any;

  SprintForm!: FormGroup;

  storyList: any = []
  sprintData: any;

  isStorySelected: Boolean = false;
  constructor(private activatedroute: ActivatedRoute, private router: Router, private form_builder: FormBuilder, private storySprintService: StorySprintService, private dialog: MatDialog, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.createSprintForm();
    this.getStoryList()
  }

  createSprintForm() {
    this.SprintForm = this.form_builder.group({
      sprint_point: ['', Validators.required],
    });
  }

  getStoryList() {
    this.storySprintService.getStoryList().subscribe((res: any) => {
      if (res?.length) {
        this.storyList = res;
        this.isStorySelected = this.storyList.some((s: any) => s.selected && s.selected == true);
      }
      else {
      }
    }, (err: any) => {
    });
  }

  submitSprintForm(formDirective: any) {
    if (this.SprintForm.invalid) {
      this.toastr.warning('Please Fill Required Fields');
      return;
    }
    this.formDirective = formDirective;

    let filterStory = this.storyList.filter((s: any) => s.story_point <= this.SprintForm.value.sprint_point);
    let sumPoint = 0;
    if (filterStory && filterStory.length) {
      for (let i = 0; i < filterStory.length; i++) {
        sumPoint += filterStory[i].story_point;
        if (sumPoint <= this.SprintForm.value.sprint_point) {
          filterStory[i].selected = true;
          this.setSelectedStory(filterStory[i]);
        }
      }
      this.isStorySelected = true;
      this.toastr.success('Sprint Generated Automatically');
      this.getStoryList();
    }
    else {
      this.toastr.warning('There Is No Stories With Given Sprint Capacity');
    }
  }

  setSelectedStory(data: any) {
    this.storySprintService.UpdateStory(data).subscribe((res: any) => {
      if (res?.id) {
      }
      else {
      }
    }, (err: any) => {
    });
  }

  clearStories(type: any) {
    if (type == 'selected') {
      const filterStoryIds = this.storyList.filter((s: any) => s.selected && s.selected == true)
      if (!filterStoryIds || !filterStoryIds.length) {
        this.toastr.warning('There Is No Selected Stories');
        return
      }
      if (window.confirm("Are You Sure !!! You Want To Delete Selected Stories ?")){
        filterStoryIds.forEach((fs: any) => this.deleteStory(fs.id))

        this.toastr.success(type == 'selected' ? 'Selected Stories Cleared' : 'All Stories Cleared');
        this.isStorySelected = false;
        this.formDirective.resetForm();
        this.SprintForm.reset();
        this.getStoryList();     
      }
    }
    else if (type == 'all') {
      const filterStoryIds = this.storyList.filter((s: any) => s.id)
      if (!filterStoryIds || !filterStoryIds.length) {
        this.toastr.warning('There Is No Stories');
        return
      }
      if (window.confirm("Are You Sure !!! You Want To Delete All Stories ?")){
        filterStoryIds.forEach((fs: any) => this.deleteStory(fs.id))

        this.toastr.success(type == 'selected' ? 'Selected Stories Cleared' : 'All Stories Cleared');
        this.isStorySelected = false;
        this.formDirective.resetForm();
        this.SprintForm.reset();
        this.getStoryList();  
      }
    }
  }

  deleteStory(id: any) {
    this.storySprintService.deleteStory(id).subscribe((res: any) => {
      // if (res?.id)
      this.getStoryList();
    }, (err: any) => {
    })
  }

  viewGeneratedSprint() {
    let dialogRef = this.dialog.open(GeneratedSprintComponent, {
      width: '50%',
      height: '75vh'
    });
  }


}
