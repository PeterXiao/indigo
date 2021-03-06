import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { ClearJobReportIndicesJobModel, SystemService } from 'app/api/service/system.service'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-system-jobs',
  templateUrl: './system-jobs.component.html',
})
export class SystemJobsComponent implements OnInit {

  form: FormGroup
  clearJob: ClearJobReportIndicesJobModel = {}

  constructor(
    private fb: FormBuilder,
    private systemService: SystemService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private router: Router,
    private location: Location,
  ) { }

  loadData() {
    this.systemService.getClearJobDetail().subscribe(res => {
      this.clearJob = res.data
      this.form = this.fb.group({
        cron: [res.data.cron || '', [Validators.required]],
        day: [res.data.day || '', [Validators.required]],
      })
    })
  }

  update() {
    const job = this.form.value as ClearJobReportIndicesJobModel
    if (job.day) {
      job.day = parseInt(job.day.toString(), 10)
    }
    this.systemService.updateClearJob(job).subscribe(res => {
      this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      this.loadData()
    })
  }

  canResume() {
    return 'PAUSED' === this.clearJob.state
  }

  canPause() {
    return 'NORMAL' === this.clearJob.state || 'COMPLETE' === this.clearJob.state
  }

  resume() {
    this.systemService.resumeClearJob().subscribe(res => {
      this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      this.loadData()
    })
  }

  pause() {
    this.systemService.pauseClearJob().subscribe(res => {
      this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      this.loadData()
    })
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      cron: ['', [Validators.required]],
      day: ['', [Validators.required]],
    })
    this.loadData()
  }
}
