class AddRefreshRateToCamera < ActiveRecord::Migration
  def up
    add_column :cameras, :refresh_rate, :integer
    Camera.all.each { |x| x.refresh_rate = 2000; x.save! }
  end
  def down
    remove_column :cameras, :refresh_rate
  end
end
