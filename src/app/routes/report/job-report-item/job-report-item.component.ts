import { Location } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { I18NService } from '@core/i18n/i18n.service'
import { NzMessageService } from 'ng-zorro-antd'

import { CaseService } from '../../../api/service/case.service'
import { JobService } from '../../../api/service/job.service'
import { ScenarioService } from '../../../api/service/scenario.service'
import {
  CaseDataItemRequest,
  CaseDataItemResponse,
  CaseReportItem,
  CaseReportItemMetrics,
  JobReportDataItem,
  KeyValueObject,
} from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'
import { formatJson } from '../../../util/json'

@Component({
  selector: 'app-job-report-item',
  templateUrl: './job-report-item.component.html',
  styles: [`
    .metrics-item:not(:first-child) {
      padding-left: 10px;
    }
    .metrics-item .metrics-item-label {
      font-size: small;
      color: darkgray;
    }
    .metrics-item .metrics-item-value {
      font-size: small;
      color: lightseagreen;
    }
    .divider-text {
      font-size: small;
      color: gray;
    }
    .label-text {
      color: #59595d;
    }
    .label-value {
      padding-left: 8px;
    }
  `]
})
export class JobReportItemComponent extends PageSingleModel implements OnInit {

  item: CaseReportItem = {}
  itemData: JobReportDataItem = {}
  metrics: CaseReportItemMetrics = {}
  request: CaseDataItemRequest = { headers: {}, body: '' }
  requestHeaders: KeyValueObject[] = []
  responseHeaders: KeyValueObject[] = []
  response: CaseDataItemResponse = { headers: {}, body: '' }
  @Input() day = ''
  @Input()
  set data(item: CaseReportItem) {
    this.item = item
  }
  jsonEditorOption = this.monocoService.getJsonOption(true)
  requestBodyEditorOption = this.monocoService.getJsonOption(true)
  responseBodyEditorOption = this.monocoService.getJsonOption(true)

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private scenarioService: ScenarioService,
    private jobService: JobService,
    private msgService: NzMessageService,
    private monocoService: MonacoService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private i18nService: I18NService,
  ) {
    super()
  }

  ngOnInit(): void {
    if (this.day && this.item.itemId) {
      this.jobService.getReportItemById(this.day, this.item.itemId).subscribe(res => {
        this.itemData = res.data
        this.metrics = this.itemData.metrics
        this.request = this.itemData.request
        this.response = this.itemData.response
        try {
          if (this.request.body) {
            const obj = JSON.parse(this.request.body)
            this.request.body = JSON.stringify(obj, null, '  ')
          }
        } catch (error) {
          this.requestBodyEditorOption = this.monocoService.getHtmlOption(true)
        }
        try {
          if (this.response.body) {
            const obj = JSON.parse(this.response.body)
            this.response.body = JSON.stringify(obj, null, '  ')
          }
        } catch (error) {
          this.responseBodyEditorOption = this.monocoService.getHtmlOption(true)
        }
        for (const k of Object.keys(this.request.headers)) {
          this.requestHeaders.push({ key: k, value: this.request.headers[k] })
        }
        for (const k of Object.keys(this.response.headers)) {
          this.responseHeaders.push({ key: k, value: this.response.headers[k] })
        }
        this.itemData.assertions = formatJson(this.itemData.assertions, 2)
        this.itemData.assertionsResult = formatJson(this.itemData.assertionsResult, 2)
      })
    }
  }
}
