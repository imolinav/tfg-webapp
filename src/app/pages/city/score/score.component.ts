import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {

  score: number;

  constructor(private dialogRef: MatDialogRef<ScoreComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
  }

  saveScore() {
    this.dialogRef.close(this.score);
  }

  get isScoreValid() {
    return this.score && this.score > 0 && this.score <=5;
  }

}
