import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StorySprintService } from '../service/story-sprint.service';

@Component({
  selector: 'app-generated-sprint',
  templateUrl: './generated-sprint.component.html',
  styleUrls: ['./generated-sprint.component.sass']
})
export class GeneratedSprintComponent implements OnInit {
  storyListDisplayedColumns: string[] = ['story_name', 'story_point'];
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
  constructor(private storySprintService: StorySprintService) { }

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
        this.storyList = res.filter((r:any) => r?.selected == true);
        this.storyListDataSource = new MatTableDataSource(this.storyList);
        this.storyListDataSource.sort = this.sort;
        this.storyListDataSource.paginator = this.paginator;
      }
      else {
      }
    }, (err: any) => {
    });
  }

}
