import * as React from 'react'
import styled from 'styled-components'
import { IData } from '../App'
import { useInteractiveContxt } from './interactiveContext'
import Log from '@ali/h5-log'
import numeral from 'numeral'
import { IFormat } from '../service'

const ratio = (v: number | string) => {
  if (v === undefined || v === null) {
    return '-'
  } else {
    return numeral(Number(v)).format('0,0.0%')
  }
}
const normal = (v: number | string, format?: IFormat) => {
  const newV = Number(v)
  if(format && format.formatOption=== '%') {
    return (newV * 100  ).toFixed(format.formatFloat) + format.formatOption
  } else
  if (Math.abs(newV) > 10) {
    return numeral(v).format('0,0')
  } else {
    return numeral(v).format('0,0.0')
  }
}
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

export interface ICustomCardProps {
  node: IData
  active: boolean
  width: number
  height: number
}
function CardItem(props: { label: string | any; value: string | any }) {
  const { label, value } = props
  return (
    <div style={{ height: 50 }}>
      <div style={{ fontFamily: 'PingFangSC-Regular', fontSize: 12, color: '#666' }} className="card-node-title">
        {label}
      </div>
      <div style={{ fontFamily: 'PingFangSC-Semibold', fontSize: 16, color: '#333' }} className="card-node-value">
        {value}
      </div>
    </div>
  )
}
export default (props: ICustomCardProps) => {
  const { node, active } = props
  const { onClickDetail, showDetail = true } = useInteractiveContxt()
  const {
    title,
    currentName,
    compareName,
    currentValue,
    compareValue,
    bizDeltaValue,
    currentLflName,
    compareLflName,
    compareLfl,
    currentLfl,
    showLfl,
    displayConfig,
    bizGrowthPercent,
    contributionPercent,
    contributionValue,
  } = node
  return (
    <div
      style={{
        cursor: 'pointer',
        borderRadius: '4px',
        border: active ? '1px solid #3858CF' : '1px solid #EEEEEE',
        background: '#fff',
        fontSize: 12,
        width: 'calc(100% - 10px)',
        height: `calc(100% - 10px)`,
        marginLeft: 5,
        marginTop: 5,
        boxShadow: '0 1px 4px 0 #d2d3e9',
        boxSizing: 'border-box',
        display: 'flex',
        position: 'relative',
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
          position: 'relative',
          lineHeight: '25px',
          borderRadius: '4px 4px 0 0 ',
          background: '#3858cf',
        }}
      >
        {node.rank && Math.abs(node.rank) <= 3 && (
          <div
            style={{
              color: node.rank < 0 ? '#e74243' : 'rgb(0, 168, 84)',
              background: 'url(https://img.alicdn.com/tfs/TB1z55UCuL2gK0jSZFmXXc7iXXa-48-66.png)',
              width: 20,
              height: 23,
              lineHeight: '18px',
              fontWeight: 'bolder',
              textAlign: 'center',
              backgroundSize: '100% 100%',
              position: 'absolute',
              left: 10,
            }}
          >
            {Math.abs(node.rank)}
          </div>
        )}
        {title}
      </div>
      <div
        style={{
          fontSize: 12,
          width: '100%',
          height: 'calc(100% - 25px)',
          padding: '12px 0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <StyledDiv>
          <CardItem label={currentName} value={normal(currentValue, displayConfig?.fieldConfig?.post)} />
          <CardItem label={compareName} value={normal(compareValue, displayConfig?.fieldConfig?.pre)} />
          {/* <CardItem label={'差异率'} value={ratio(bizGrowthPercent)} />
          <CardItem label={'贡献值'} value={normal(contributionValue)} /> */}
          {showLfl && (
            <>
              <CardItem label={'店均-月环比'} value={ratio(currentLfl)} />
              <CardItem label={'店均-月环比'} value={ratio(compareLfl)} />
            </>
          )}

          <CardItem label={'差额'} value={normal(bizDeltaValue, displayConfig?.fieldConfig?.delta)} />
          <CardItem
            label={'贡献度'}
            value={
              <span style={{ color: contributionPercent > 0 ? '#46bc15' : '#e74243' }}>
                {ratio(contributionPercent)}
              </span>
            }
          />
        </StyledDiv>
        <div style={{ display: 'flex', justifyContent: 'center', color: '#23a4ff' }}>
          {showDetail && (
            <span
              onClick={() => {
                onClickDetail(node)
                Log.sendPCCustomGoldenLog({ navName: '品类画像', key: '_purchaser_clicklog_4' })
              }}
            >
              查看明细
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
