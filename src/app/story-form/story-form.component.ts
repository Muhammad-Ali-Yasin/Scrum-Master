import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { StorySprintService } from './../service/story-sprint.service';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-story-form',
  templateUrl: './story-form.component.html',
  styleUrls: ['./story-form.component.sass']
})
export class StoryFormComponent implements OnInit {
  storyID: any;
  isEdit = false;

  formDirective: any;

  StoryForm!: FormGroup;

  storyList: any = [];
  storyData: any;
  constructor(private activatedroute: ActivatedRoute, private router: Router, private form_builder: FormBuilder, private storySprintService: StorySprintService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.createStoryForm();
    this.getStoryList();
    let hrefArr = this.router.url.split('/');

    if (hrefArr.includes("edit-story")) {
      this.storyID = this.activatedroute.snapshot.paramMap.get("id");
      if (!this.storyID)
        this.router.navigateByUrl('/story-list');
      this.isEdit = true;
      this.getStory();
    }
  }

  createStoryForm() {
    this.StoryForm = this.form_builder.group({
      story_name: ['', Validators.required],
      story_point: ['', Validators.required],
    });
  }

  getStoryList() {
    this.storySprintService.getStoryList().subscribe((res: any) => {
      if (res?.length) {
        this.storyList = res;
      }
      else {
      }
    }, (err: any) => {
    });
  }

  getStory() {
    this.storySprintService.getStory(this.storyID).subscribe((res: any) => {
      if (res?.id) {
        this.storyData = res;
        if (this.storyData?.story_name)
          this.StoryForm.controls['story_name'].setValue(this.storyData.story_name);
        if (this.storyData?.story_point)
          this.StoryForm.controls['story_point'].setValue(this.storyData.story_point);
      }
      else {
      }
    }, (err: any) => {
    });

  }

  submitStoryForm(formDirective: any) {
    if (this.StoryForm.invalid) {
      this.toastr.warning('Please Fill Required Fields');
      return;
    }
    this.formDirective = formDirective;

    const data: any = {
      id: this.isEdit ? this.storyID : 0,
      story_name: this.StoryForm.value.story_name,
      story_point: this.StoryForm.value.story_point,
    };

    if (!this.isEdit) {
      const find = this.storyList.find((s: any) => s.story_name == this.StoryForm.value.story_name);
      if (find) {
      this.toastr.warning('Story Already Exist');
        return;
      };
      this.storySprintService.CreateStory(data).subscribe((res: any) => {
        if (res?.id) {
          this.formDirective.resetForm();
          this.StoryForm.reset();
          this.toastr.success('Story Created Successfully');
          this.router.navigateByUrl('/story-list');
        }
        else {
        }
      }, (err: any) => {
      });
    }
    else {
      this.storySprintService.UpdateStory(data).subscribe((res: any) => {
        if (res?.id) {
          this.formDirective.resetForm();
          this.StoryForm.reset();
          this.toastr.success('Story Updated Successfully');
          this.router.navigateByUrl('/story-list');
        }
        else {
        }
      }, (err: any) => {
      });
    }

  }
}
