'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export function Registry() {
  return (
    <div>
      <Button />
      <Card>
        <CardHeader>
          <CardTitle />
          <CardDescription />
        </CardHeader>
        <CardContent />
        <CardFooter />
      </Card>
      <Dialog>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle />
            <DialogDescription />
          </DialogHeader>
          <DialogFooter />
        </DialogContent>
      </Dialog>
      <Input />
      <Label />
      <Badge />
    </div>
  )
}
