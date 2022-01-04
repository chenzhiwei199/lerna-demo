import { active } from 'd3'
import * as React from 'react'
import styled from 'styled-components'
import { IChartData, IData } from '../App'
import { INode } from '.'
import { LineBarChart } from '@alife/hippo-vis'
import { ShowDataType, useShowDataType } from './ShowDataTypeContext'
const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 50%);
  overflow: hidden;
  text-align: right;
  padding: 0 12px;
  -webkit-line-clamp: 2;
  line-height: 20px;
  -webkit-box-orient: vertical;
`
export interface ICardProps {
  node: IChartData
  active: boolean
  width: number
  height: number
}
export default (props: ICardProps) => {
  const { node, width, height, active } = props
  const { title, data } = node
  const { type } = useShowDataType()
  const formatter = (v) => numeral(v).format('0,0')
  const ratioFormatter = (v) => numeral(v).format('0,0%')
  let series = [] as any
  if (type === ShowDataType.Detail) {
    series = [{
      type: 'bar',
      code: 'currentValue',
      name: '当前金额',
      formatter
    }, {
      type: 'bar',
      code: 'compareValue',
      name: '对比公司金额',
      formatter
    }]
  } else if (type === ShowDataType.Contribution) {
    series = [{
      type: 'bar',
      code: 'contributionValue',
      name: '贡献值',
      formatter,
    }]
  } else if (type === ShowDataType.ContributionPercent) {
    series = [{
      type: 'bar',
      code: 'contributionPercent',
      name: '贡献度',
      formatter: ratioFormatter,
    }]
  }
  return (
    <div
      style={{
        cursor: 'pointer',
        borderRadius: '4px',
        border: active ? '1px solid #3858CF' : '1px solid #EEEEEE',
        background: '#fff',
        width,
        height,
        fontSize: 12,
        position: 'relative',
        boxSizing: 'border-box',
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          color: 'white',
          height: 25,
          lineHeight: '25px',
          borderRadius: '4px 4px 0 0 ',
          background: '#3858cf',
        }}
      >
        {title}
      </div>
      <LineBarChart
        style={{ width: '100%' }}
        data={data}
        x="title"
        series={series}
      />
    </div>
  )
}
