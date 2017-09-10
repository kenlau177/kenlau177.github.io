setwd("//aglc.goa.ds//data//UsrDataSA//KLau//Windows//Desktop//TEMP//Keep//vltmonitor//data")

library(dplyr)

dat = read.csv("batch.csv")

map_from = unique(dat$site)
map_to = paste0("site ", 1:length(map_from))

dat$terms = sample(1:2, nrow(dat), replace=T)
dat$nearby = "1 | 5 | 10"
dat$ns = sample(-10000:12000, nrow(dat), replace=T)
dat$nsptw = sample(round(-10000/13):round(12000/13), nrow(dat), replace=T)
dat$site = plyr::mapvalues(dat$site, from = map_from, to = map_to)

write.csv(dat, "batch.csv", row.names=F)

dat = read.csv("batch_adjusted.csv")

dat$terms = sample(1:2, nrow(dat), replace=T)
dat$nearby = "1 | 5 | 10"
dat$ns = sample(-10000:12000, nrow(dat), replace=T)
dat$nsptw = sample(round(-10000/13):round(12000/13), nrow(dat), replace=T)
dat$site = plyr::mapvalues(dat$site, from = map_from, to = map_to)

write.csv(dat, "batch_adjusted.csv", row.names=F)

dat = read.csv("terminal-trend-plot-dat.csv")

dat$nsptd = sample(100:300, nrow(dat), replace=T)
dat$site = plyr::mapvalues(dat$site, from = map_from, to = map_to)

write.csv(dat, "terminal-trend-plot-dat.csv", row.names=F)

dat = read.csv("sites.csv")
dat$site = plyr::mapvalues(dat$site, from = map_from, to = map_to)

write.csv(dat, "sites.csv", row.names=F)
