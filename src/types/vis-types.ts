export type VisNodesTypes = {
  id: string
  label: string
  color: string
  title?: string
  x?: number
  y?: number
}

export type VisEdgesTypes = {
  from: number
  to: number
  color: string
  label?: string
  font?: {
    align: string
  }
}

export type VisDataTypes = {
  nodes: VisNodesTypes[]
  edges: VisEdgesTypes[]
}