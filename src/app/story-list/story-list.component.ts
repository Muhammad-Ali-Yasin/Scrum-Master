import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';

import { StorySprintService } from './../service/story-sprint.service'
import { ToastrService } from 'ngx-toastr'
@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.sass']
})
export class StoryListComponent implements OnInit {
  storyListDisplayedColumns: string[] = ['story_name', 'story_point', 'action'];
  storyListDataSource: any = new MatTableDataSource();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  storyList: any = [];

  storyTablePagination = {
    Count: 6,
    pageIndex: 0,
    pageSize: 5,
    pageSizeOptions: [5],
  }
  constructor(private router: Router, private storySprintService: StorySprintService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getStoryList();
  }

  ngAfterViewInit(): void {
    this.storyListDataSource.sort = this.sort;
    this.storyListDataSource.paginator = this.paginator;
  }

  onPaginateChange(event: any) {
    this.storyTablePagination.pageIndex = event.pageIndex;
    this.storyTablePagination.pageSize = event.pageSize;
  }

  applyFilter(event: any) {
    this.storyListDataSource.filter = event.target.value.trim().toLowerCase();

    if (this.storyListDataSource.paginator) {
      this.storyListDataSource.paginator.firstPage();
    }

    this.storyListDataSource.sort = this.sort;
  }

  getStoryList() {
    this.storySprintService.getStoryList().subscribe((res: any) => {
      if (res?.length) {
        this.storyList = res;
        this.storyListDataSource = new MatTableDataSource(this.storyList);
        this.storyListDataSource.sort = this.sort;
        this.storyListDataSource.paginator = this.paginator;
      }
      else {
      }
    }, (err: any) => {
    });
  }

  navigateToStoryForm(type: any, id: any) {
    if (type == 'create')
      this.router.navigateByUrl('/create-story')
    else if (type == 'edit')
      this.router.navigate(['/edit-story', id])
  }

  deleteStory(id: any) {
    this.storySprintService.deleteStory(id).subscribe((res: any) => {
      this.toastr.success('Story Deleted Successfully');
        this.getStoryList();
    }, (err: any) => {
    })
  }
}
